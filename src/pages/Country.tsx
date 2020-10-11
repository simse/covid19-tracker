import React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/react';
// import { arrowUpOutline } from 'ionicons/icons';
import "../styles/country.scss";

interface CountryPageProps extends RouteComponentProps<{
  id: string;
}> {}

const Country: React.FC<CountryPageProps> = ({match}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>

          <IonTitle>Country</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Country</IonTitle>
          </IonToolbar>
        </IonHeader>

        {match.params.id}
      </IonContent>
    </IonPage>
  );
};

export default Country;
