import { Button } from "@repo/ui/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/ui/card"

export default function page() {
  return (
    <Card size="sm" className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Small Card</CardTitle>
        <CardDescription>
          This card uses the small size variant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The card component supports a size prop that can be set to
          &quot;sm&quot; for a more compact appearance.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full text-primary-foreground">
          Action
        </Button>
      </CardFooter>
    </Card>
  )
}
