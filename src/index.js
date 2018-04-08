import React from 'react';
import ReactDOM from 'react-dom';
import PrayerRoot from './PrayerRoot/PrayerRoot';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<PrayerRoot />, document.getElementById('root'));
registerServiceWorker();
