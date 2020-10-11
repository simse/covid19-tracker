import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonList, IonLabel, IonSearchbar } from '@ionic/react';

import './Tab2.css';

const countries = [
  {
    name: "Denmark",
    iso: "DK",
    flag: require("../assets/flags/dk.svg")
  },
  {
    name: "Sweden",
    iso: "SE",
    flag: require("../assets/flags/se.svg")
  },
  {
    name: "Norway",
    iso: "NO",
    flag: require("../assets/flags/no.svg")
  },
  {
    name: "Finland",
    iso: "FI",
    flag: require("../assets/flags/fi.svg")
  },
  {
    name: "United Kingdom",
    iso: "UK",
    flag: require("../assets/flags/gb.svg")
  },
  {
    name: "United States",
    iso: "US",
    flag: require("../assets/flags/us.svg")
  }
]

const Tab2: React.FC = () => {
  const [searchText, setSearchText] = useState('');

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

        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>

        <IonList>
          {countries.map(country => (
            <IonItem routerLink={"/countries/" + country.iso} key={country.iso}>
              <div className="country">
                <img alt={"Flag of " + country.name} className="flag" src={country.flag} />

                <IonLabel>{country.name}</IonLabel>
              </div>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
