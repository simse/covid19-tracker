import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonList, IonLabel, IonSkeletonText } from '@ionic/react';

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
  searchTerm?: string;
}

class Countries extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      countries: [],
      hasLoaded: false,
      searchTerm: ""
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

  renderListOfCountries() {
    if (this.state.countries.length > 0) {
      return (

  
          <IonList>
            {this.state.countries.map(country => (
              <IonItem routerLink={"/countries/" + country["iso3166-2"]} key={country["iso3166-2"]}>
                <div className="country-item">
                  <img src={require("../assets/flags/" + country["iso3166-2"] + ".svg")} className={"flag"} alt={"The flag of " + country.name} />
  
                  <IonLabel>{country.name}</IonLabel>
                </div>
              </IonItem>
            ))}
          </IonList>
      ) 
    }
  }

  render() {
    return (
      <IonPage>
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
  

          <div className={"countries"}>
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