
import React from "react";

const RulesAndRegulationsPage = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Rules and Regulations</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Eligibility and Registration</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>All registrations must be submitted through an official dance school.</li>
            <li>Dance schools register their dancers on the DWC event system.</li>
            <li>DWC/IDN Membership required for all participants.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Judging and Scoring</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Judging Panel: International DWC judges and local judges (international judges outnumber local judges).</li>
            <li>Minimum qualifying score: 70 points (required to qualify for DWC Finals).</li>
            <li>Scoring criteria: Technique, Performance and Expression, Choreography, Musicality and Timing.</li>
            <li>Judges' decisions are final and cannot be appealed.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Awards</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Medal/Certificate Distribution by Score:
              <ul className="list-disc list-inside ml-4">
                  <li>Gold: 90 and above</li>
                  <li>Silver: 80-89</li>
                  <li>Bronze: 70-79</li>
              </ul>
            </li>
            <li>Special Awards for Winners:
                <ul className="list-disc list-inside ml-4">
                    <li>Solo & Duet/Trio Winners: Free entry to the Finals for the winning dances</li>
                    <li>Small & Large Group Winners: Voucher towards entry fees for the Finals</li>
                </ul>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Important Requirements</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Dance schools must ensure routines meet DWC rules for choreography, costumes, and music.</li>
            <li>Dancers must compete in appropriate age category with age verification.</li>
            <li>Refer to DWC guidelines for detailed competition rules.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RulesAndRegulationsPage;
