import React, { useState, useEffect } from 'react'
import styles from "./Footer.module.css"
import { getPageContent } from '../../services/pageContentService'

/**
 * Footer component for the application
 * @returns {JSX.Element} Footer
 * @constructor
 */
function Footer() {
  const [footerContent, setFooterContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      const content = await getPageContent('footer');
      setFooterContent(content);
    };
    fetchContent();
  }, []);

  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>{footerContent}</p>
    </footer>
  )
}

export default Footer