import React from 'react'
import ReactDOM from 'react-dom'
// Component
import PoiCard from './PoiCard'

class App extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        pois: {},
        userView: {},
        userLat: {},
        userLng: {},
        mapBounds: {}
      }
    }

  componentDidMount() {
    fetch('/around/spots.json')
      .then(response => response.json())
      .then(response => {
        this.setState({
          pois: response
        })
      })
    map.on('moveend', move => {
      const centerMap = map.getCenter()
      const bounds = map.getBounds()
      this.setState({
        userView: centerMap,
        mapBounds: bounds
      })
    })
    navigator.geolocation.getCurrentPosition(position => {
      localStorage.setItem('userLat', position.coords.latitude)
      localStorage.setItem('userLng', position.coords.longitude)
      this.setState({
        userLat: parseFloat(localStorage.userLat),
        userLng: parseFloat(localStorage.userLng)
       })
    })
  }

  render() {
    const cards = Object
      .keys(this.state.pois)
      .filter(key => {
        return (
          this.state.pois[key].position.latitude <=  this.state.mapBounds._ne.lat
          &&
          this.state.pois[key].position.latitude >=  this.state.mapBounds._sw.lat
          &&
          this.state.pois[key].position.longitude <=  this.state.mapBounds._ne.lng
          &&
          this.state.pois[key].position.longitude >=  this.state.mapBounds._sw.lng
        )
      })
      .map(key =>
        <PoiCard
          key={key}
          details={this.state.pois[key]}
          userLat={this.state.userLat}
          userLng={this.state.userLng}
        />
      )

    return (
      <div>{cards}</div>
    )
   }
 }

ReactDOM.render(
  <App />,
  document.getElementById('poi-cards')
)
