
import { useState, useEffect } from 'react';

interface LegalNotices {
  cookies: boolean;
  dataUsage: boolean;
  terms: boolean;
}

export const useLegalNotices = () => {
  const [notices, setNotices] = useState<LegalNotices>({
    cookies: false,
    dataUsage: false,
    terms: false
  });

  useEffect(() => {
    const savedNotices = localStorage.getItem('legal-notices-accepted');
    if (savedNotices) {
      try {
        setNotices(JSON.parse(savedNotices));
      } catch (error) {
        console.error('Error parsing legal notices:', error);
      }
    }
  }, []);

  const acceptNotice = (type: keyof LegalNotices) => {
    const newNotices = { ...notices, [type]: true };
    setNotices(newNotices);
    localStorage.setItem('legal-notices-accepted', JSON.stringify(newNotices));
  };

  const acceptAllNotices = () => {
    const allAccepted = { cookies: true, dataUsage: true, terms: true };
    setNotices(allAccepted);
    localStorage.setItem('legal-notices-accepted', JSON.stringify(allAccepted));
  };

  return {
    notices,
    acceptNotice,
    acceptAllNotices,
    hasUnacceptedNotices: !notices.cookies || !notices.dataUsage || !notices.terms
  };
};
