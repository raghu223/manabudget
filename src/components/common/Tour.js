import React, { useState } from 'react';
import Joyride from 'react-joyride';

const Tour = () => {
  const [run, setRun] = useState(true);
  const steps = [
    {
      target: '.nav-links',
      content: 'Navigate between Dashboard, Budget, Investments, and Profile here.',
    },
    {
      target: '.dashboard-container',
      content: 'Your personalized dashboard with investment and budget summary.',
    },
    {
      target: '.investment-form-container',
      content: 'Add new investments and track your returns easily.',
    },
    {
      target: '.features-list',
      content: 'See all the powerful features ManaBudget offers!',
    },
    {
      target: '.cta-buttons',
      content: 'Get started or log in to unlock all features.',
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      styles={{ options: { zIndex: 10000 } }}
      callback={data => {
        if (data.status === 'finished' || data.status === 'skipped') setRun(false);
      }}
    />
  );
};

export default Tour;
