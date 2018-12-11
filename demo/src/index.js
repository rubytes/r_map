import React, {Component} from 'react'
import {render} from 'react-dom'

import { Map } from '../../src'

const TEST_DATA = [
  {
    "Uuid": "8c2c434b-07f7-4ebc-9bc6-9c15cdd75c4c",
    "Title": "Fastmerker & Basestajoner WMS",
    "DistributionProtocol": "OGC:WMS",
    "GetCapabilitiesUrl": "https://openwms.statkart.no/skwms1/wms.fastmerker2?request=GetCapabilities&service=WMS",
    addLayers:[]
  },
  {
    "Uuid": "8045628b-230a-4ba4-a6e0-xxxxx",
    "Title": "Abas",
    "DistributionProtocol": "OGC:WMS",
    "GetCapabilitiesUrl": "https://openwms.statkart.no/skwms1/wms.adm_enheter?request=GetCapabilities&service=WMS",
    addLayers:[]
  },
  {
    "Uuid": "test-07f7-4ebc-9bc6-9c15cdd75c4c",
    "Title": "norgeskart",
    "DistributionProtocol": "OGC:WMTS",
    "GetCapabilitiesUrl": "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?request=GetCapabilities&service=WMS",
    addLayers:[]
  }
]

class Demo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      services: TEST_DATA
    };
  }
  
  render() {
    return <div>
      <Map services = { this.state.services }  menu = {true}/>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
