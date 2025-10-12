import InfoCard from "@/components/InfoCard";
import React from "react";

const EventInformation = () => {
  return (
    <section className="max-width py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Event Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* <InfoCard
            title="Categories & Entry Fees"
            content={
              <ul>
                <li>Solo: ₦10,704 (€6)</li>
                <li>Duet/Trio: ₦9,812 (€5.50)</li>
                <li>Small Group (4-9 dancers): ₦8,920 (€5)</li>
                <li>Large Group (10+ dancers): ₦8,028 (€4.50)</li>
                <li>Spectator Admission: ₦3,568 (€2)</li>
              </ul>
            }
          /> */}
          <InfoCard
            title="Dance Genres"
            content={
              <ul>
                <li>Ballet & Neo Classical</li>
                <li>Modern/Lyrical & Contemporary</li>
                <li>Jazz/Show-Dance</li>
                <li>Hip-Hop/Street Dance & Commercial</li>
                <li>National Dance</li>
                <li>Step Dance & Song and Dance</li>
              </ul>
            }
          />
          <InfoCard
            title="Awards"
            content={
              <ul>
                <li>Gold: 90 and above</li>
                <li>Silver: 80-89</li>
                <li>Bronze: 70-79</li>
              </ul>
            }
          />
          <InfoCard
            title="Dance Styles"
            content={
              <ul className="list-disc list-inside">
                <li>Acrobatic Dance</li>
                <li>Ballet - Repertoire</li>
                <li>Ballet - Neoclassical / Classical</li>
                <li>Contemporary</li>
                <li>Lyrical</li>
                <li>National & Folklore</li>
                <li>Showstopper</li>
                <li>Jazz</li>
                <li>Tap</li>
                <li>Street Dance and Commercial</li>
              </ul>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default EventInformation;
