import { Avatar, AvatarFallback } from "#/ui/components/avatar";
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "#/ui/components/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "#/ui/components/message";
import { Marker } from "#/ui/components/marker";

export default function ChatInterfaceMessagesSection() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-muted/25">
      <div className="flex w-full flex-col gap-5 p-4 sm:gap-6 sm:p-6 lg:p-8">
        <Marker
          variant="separator"
          className="text-[11px] uppercase tracking-wider"
        >
          Today · 4:55 PM
        </Marker>

        <Message align="end">
          <MessageAvatar>
            <Avatar>
              <AvatarFallback className="bg-primary/20 text-primary-foreground">
                ME
              </AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble>
              <BubbleContent>Deploying to prod real quick.</BubbleContent>
            </Bubble>
            <MessageFooter>4:52 PM · Delivered</MessageFooter>
          </MessageContent>
        </Message>

        <Message>
          <MessageAvatar>
            <Avatar>
              <AvatarFallback className="bg-emerald-100 text-emerald-700">
                MA
              </AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>It&apos;s 4:55 PM. On a Friday.</BubbleContent>
            </Bubble>
            <MessageFooter>4:55 PM</MessageFooter>
          </MessageContent>
        </Message>

        <Message align="end">
          <MessageAvatar>
            <Avatar>
              <AvatarFallback className="bg-primary/20 text-primary-foreground">
                ME
              </AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble>
              <BubbleContent>It&apos;s a one-line change.</BubbleContent>
            </Bubble>
            <MessageFooter>4:56 PM · Delivered</MessageFooter>
          </MessageContent>
        </Message>

        <Message>
          <MessageAvatar>
            <Avatar>
              <AvatarFallback className="bg-emerald-100 text-emerald-700">
                MA
              </AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <BubbleGroup>
              <Bubble variant="muted">
                <BubbleContent>
                  It&apos;s always a one-line change 😭.
                </BubbleContent>
              </Bubble>
              <Bubble variant="muted">
                <BubbleContent>Alright, let me take a look.</BubbleContent>
                <BubbleReactions aria-label="Reactions: thumbs up">
                  <span>👍</span>
                </BubbleReactions>
              </Bubble>
            </BubbleGroup>
            <MessageFooter>4:58 PM</MessageFooter>
          </MessageContent>
        </Message>
      </div>
    </div>
  );
}
