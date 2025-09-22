import React, { useState } from 'react';
import { IonImg } from '@ionic/react';

const MinimalMaximizeImage = ({ src, alt }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div
      style={{ cursor: 'pointer', width: isMaximized ? '100%' : '50%' }}
      onClick={toggleMaximize}
    >
      <IonImg
        src={src}
        alt={alt}
        style={{ width: isMaximized ? '100%' : '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default MinimalMaximizeImage;
