import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { WhatsAppWebhookService } from './whatsapp-webhook.service';

@ApiTags('webhooks')
@Public()
@Controller('webhooks/whatsapp')
export class WhatsAppWebhookController {
  constructor(
    private readonly whatsAppWebhookService: WhatsAppWebhookService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify the WhatsApp webhook subscription',
    description:
      'Meta calls this endpoint when the webhook is configured. The challenge is returned as plain text when the verification token matches.',
  })
  @ApiQuery({ name: 'hub.mode', required: true, example: 'subscribe' })
  @ApiQuery({
    name: 'hub.verify_token',
    required: true,
    example: 'your-webhook-verify-token',
  })
  @ApiQuery({
    name: 'hub.challenge',
    required: true,
    example: '1234567890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The Meta challenge, returned as plain text.',
    schema: { type: 'string', example: '1234567890' },
  })
  verify(
    @Query('hub.mode') mode: string | undefined,
    @Query('hub.verify_token') verifyToken: string | undefined,
    @Query('hub.challenge') challenge: string | undefined,
  ): string {
    return this.whatsAppWebhookService.verifySubscription(
      mode,
      verifyToken,
      challenge,
    );
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Receive WhatsApp webhook events',
    description:
      "Receives inbound messages, delivery statuses, and other WhatsApp Cloud API events. The request must include Meta's HMAC SHA-256 signature.",
  })
  @ApiHeader({
    name: 'X-Hub-Signature-256',
    required: true,
    description: 'HMAC SHA-256 signature of the raw request body.',
  })
  @ApiBody({
    description: 'WhatsApp Cloud API webhook payload.',
    schema: {
      type: 'object',
      required: ['object', 'entry'],
      additionalProperties: true,
    },
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Webhook accepted.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The webhook signature is missing or invalid.',
  })
  async receive(
    @Req() request: RawBodyRequest<Request>,
    @Body() payload: unknown,
  ): Promise<void> {
    this.whatsAppWebhookService.assertValidSignature(
      request.header('x-hub-signature-256'),
      request.rawBody,
    );

    await this.whatsAppWebhookService.handleEvent(payload);
  }
}
