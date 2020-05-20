import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'

import ServicePanel from './components/ServicePanel/ServicePanel'
import BackgroundChooser from './components/BackgroundChooser/BackgroundChooser'
import MapComponent from './components/MapComponent/MapComponent'
import MapContainer from './components/MapContainer/MapContainer'
import Legend from './components/Legend/Legend'

ReactDOM.render(
    <App />,
   document.getElementById('root')
)

serviceWorker.unregister()

export { ServicePanel, BackgroundChooser, MapComponent, MapContainer, Legend }
