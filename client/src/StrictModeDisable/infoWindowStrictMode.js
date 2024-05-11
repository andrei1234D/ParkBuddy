import React, { forwardRef } from 'react';
import { InfoWindow } from '@react-google-maps/api';

const InfoWindowWithoutStrictMode = forwardRef((props, ref) => (
  <InfoWindow {...props} ref={ref} />
));

export default InfoWindowWithoutStrictMode;
