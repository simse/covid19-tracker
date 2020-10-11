import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonChip, IonLabel } from '@ionic/react';
// import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <div className={"padding"}>
          <h3 className={"section-title"}>Worldwide statistics</h3>

          <IonChip>
            <IonLabel color="secondary">Cases</IonLabel>
          </IonChip>

          <IonChip>
            <IonLabel color="secondary">Deaths</IonLabel>
          </IonChip>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
