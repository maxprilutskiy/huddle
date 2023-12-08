import { Button, Card, CardBody, Image, Spacer } from "@nextui-org/react";
import clsx from "clsx";

export default function ProfileSuggestionCard(props: ProfileSuggestionCardProps) {
  return (
    <Card
      isBlurred
      className={clsx(`p-4 border border-foreground-100`, props.className)}
      shadow="sm"
    >
      <CardBody className="flex flex-col items-center gap-8">
        <Image
          className="h-[320px] rounded-xl"
          src={props.profilePictureUrl}
          alt="Profile picture"
        />
        <section className="grow">
          <h3 className="text-xl font-bold">{props.name}</h3>
          <h4 className="text-md text-foreground-500">{props.location}</h4>
          <Spacer y={2} />
          <strong className="text-sm">Works on: </strong>
          <p className="text-sm">{props.companyDescription}</p>
          <Spacer y={2} />
          <strong className="text-sm">Latest achievement: </strong>
          <p className="text-sm">{props.latestAchievement}</p>
          <Spacer y={2} />
          <strong className="text-sm">Current challenge: </strong>
          <p className="text-sm">{props.currentChallenge}</p>
          <Spacer y={4} />
          <Button
            variant="flat"
            fullWidth
            children="Skip"
            onClick={props.onRefresh}
          />
          <Spacer y={2} />
          <Button
            variant="solid"
            color="success"
            fullWidth
            children="Connect"
            onClick={handleConnectClick}
          />
        </section>
      </CardBody>
    </Card>
  );

  function handleConnectClick() {
    const possibleEmail = `${props.name.replace(/\s/g, '')}@example.com`;
    // google calendar url that's pre-filled with the user's email
    const eventText = `Let's meet up!`;
    const eventDates = /* next week from now */ new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '') + '/' + /* next week from now + 1 hour */ new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const googleCalendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${eventText}&dates=${eventDates}&ctz=America%2FNew_York&sf=true&output=xml&add=${possibleEmail}`;
    window.open(googleCalendarUrl, '_blank');
  }
}

export type ProfileSuggestionCardProps = {
  className?: string;

  profilePictureUrl: string;
  name: string;
  location: string;

  companyDescription: string;
  latestAchievement: string;
  currentChallenge: string;

  suggestionReason: string;

  onRefresh?: () => void;
};
