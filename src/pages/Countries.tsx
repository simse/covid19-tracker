import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonList, IonLabel, IonSkeletonText, IonSearchbar } from '@ionic/react';

import Fuse from 'fuse.js';
import "../styles/countries.scss";


interface IProps {
}

interface Country {
  name: string;
  "iso3166-2": string;
  summary: string;
}

interface IState {
  countries: Array<Country>;
  hasLoaded?: boolean;
  searchTerm: string;
}

class Countries extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      countries: [],
      hasLoaded: false,
      searchTerm: "",

    }
  }

  setLoadingState(newState: boolean) {
    this.setState({
      hasLoaded: newState
    })
  }

  setCountriesList(countries: Array<Country>) {
    this.setState({
      countries: countries
    })
  }

  componentDidMount() {
    fetch("https://api.avoidthe.icu/countries.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.setLoadingState(true)
          this.setCountriesList(result)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        () => {
          this.setLoadingState(false)
        }
      )      
  }

  getFilteredCountries(): Array<Country> {
    if (this.state.searchTerm === "") {
      return this.state.countries
    } else {
      const options = {
        includeScore: true,
        keys: ['name']
      }

      const countryIndex = new Fuse(this.state.countries, options)
      let result: Array<Country> = []

      countryIndex.search(this.state.searchTerm).forEach(country => {
        result.push(country.item)
      })

      return result
    }
  }

  getCountryFlag(iso?: string) {
    if (iso) {
      try {
        return require("../assets/flags/" + iso.toLowerCase() + ".svg")
      } catch(e) {
        return require("../assets/flags/dk.svg")
      }
    } else {
      return require("../assets/flags/dk.svg")
    }
  }

  renderListOfCountries() {
    if (this.state.countries.length > 0) {
      return (

  
          <IonList>
            {this.getFilteredCountries().map(country => (
              <IonItem routerLink={"/countries/" + country["iso3166-2"]} key={country["iso3166-2"]}>
                <div className="country-item">
                  <img src={this.getCountryFlag(country["iso3166-2"])} className={"flag"} alt={"The flag of " + country.name} />
  
                  <IonLabel>{country.name}</IonLabel>
                </div>
              </IonItem>
            ))}
          </IonList>
      ) 
    }
  }

  setSearchTerm(term: string) {
    this.setState({
      searchTerm: term
    })
  }

  render() {
    return (
      <IonPage className={"countries"}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Countries</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Countries</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonSearchbar value={this.state.searchTerm} onIonChange={e => this.setSearchTerm(e.detail.value!)}></IonSearchbar>

          <div>
            {!this.state.hasLoaded &&
            
              <IonList>
                <IonItem>
                  <div className="country-item loading">
                    <div className="placeholder-image"></div>
    
                    <IonLabel><IonSkeletonText animated style={{ width: '50%' }} /><IonSkeletonText animated style={{ width: '80%' }} /></IonLabel>
                  </div>
                </IonItem>
              </IonList>
            }
    
            
            {this.state.hasLoaded &&
            this.renderListOfCountries()
            }
          </div>
        </IonContent>
      </IonPage>
    );
  }
}

export default Countries