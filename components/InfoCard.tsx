
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface InfoCardProps {
  title: string;
  content: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, content }) => {
  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};

export default InfoCard;
