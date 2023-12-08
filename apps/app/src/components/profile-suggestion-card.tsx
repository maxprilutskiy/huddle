import { Card } from "@nextui-org/react";

export function ProfileSuggestionCard(props: ProfileSuggestionCardProps) {
  return (
    <Card>

    </Card>  
  );
}

export type ProfileSuggestionCardProps = {
  profilePictureUrl: string;
  name: string;
  location: string;

  companyDescription: string;
  latestAchievement: string;
  currentChallenge: string;

  suggestionReason: string;
};
