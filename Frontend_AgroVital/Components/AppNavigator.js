import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Page1 from './DescriptionPages/Page1';
import Page2 from './DescriptionPages/Page2';
import Page3 from './DescriptionPages/Page3';
import Page4 from './DescriptionPages/Page4';
import Page5 from './DescriptionPages/Page5';
import LocationAccessPage from './LocationAccessPage';
import LanguageSelection from './LanguageSelection';
import Login from './Login'; 
import Register from './Register';
import Home from './Home';
import Weather from './Weather';
import Profile from './Profile';
import Settings from './Settings';
import Contact from './Contact';
import Library from './Library';
import Stage1 from './DiseasePages/Stage1';
import Stage2 from './DiseasePages/Stage2';
import Stage3 from './DiseasePages/Stage3';
import Stage4 from './DiseasePages/Stage4';
import Chatbot from './Chatbot';
import ProfileSave from './ProfileSave';
import Language from './Language';
import AskCommunityScreen from './AskCommunityScreen';
import MainCommunityScreen from './MainCommunityScreen';
import PostDetailScreen from './PostDetailScreen';
import MarketPlace from './MarketPlacePages/MarketPlace';
import Agrishops from './MarketPlacePages/Agrishops';
import Fertilizers from './MarketPlacePages/Fertilizers';
import Medications from './MarketPlacePages/Medications';
import Equipments from './MarketPlacePages/Equipments';
import AgrishopDetails from './MarketPlacePages/AgrishopDetails';
import FertilizerDetails from './MarketPlacePages/FertilizerDetails';
import MedicationDetails from './MarketPlacePages/MedicationDetails';
import EquipmentDetails from './MarketPlacePages/EquipmentDetails';
import SoilMonitoringInstructions from './SoilMonitoringInstructions';
import SoilDataDisplay from './SoilDataDisplay';
import DiagnosisHistoryScreen from './DiagnosisHistoryScreen';
import DiagnosisResult from './DiagnosisResult';
import ReportScreen from './DiagnosisReportScreen';
import FeedbackForm from './FeedbackForm';
import ForgotPassword from './ForgotPassword';
import OtpVerification from './OtpVerification';
import ResetPassword from './ResetPassword';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Page1" component={Page1} />
      <Stack.Screen name="Page2" component={Page2} />
      <Stack.Screen name="Page3" component={Page3} />
      <Stack.Screen name="Page4" component={Page4} />
      <Stack.Screen name="Page5" component={Page5} />
      <Stack.Screen name="LocationAccessPage" component={LocationAccessPage} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Weather" component={Weather} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Contact" component={Contact} />
      <Stack.Screen name="Library" component={Library} />
      <Stack.Screen name="Stage1" component={Stage1} />
      <Stack.Screen name="Stage2" component={Stage2} />
      <Stack.Screen name="Stage3" component={Stage3} />
      <Stack.Screen name="Stage4" component={Stage4} />
      <Stack.Screen name="Chatbot" component={Chatbot} />
      <Stack.Screen name="ProfileSave" component={ProfileSave} />
      <Stack.Screen name="Language" component={Language} />
      <Stack.Screen name="AskCommunityScreen" component={AskCommunityScreen} />
      <Stack.Screen name="MainCommunityScreen" component={MainCommunityScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="MarketPlace" component={MarketPlace} />
      <Stack.Screen name="Agrishops" component={Agrishops} />
      <Stack.Screen name="Fertilizers" component={Fertilizers} />
      <Stack.Screen name="Medications" component={Medications} />
      <Stack.Screen name="Equipments" component={Equipments} />
      <Stack.Screen name="AgrishopDetails" component={AgrishopDetails} />
      <Stack.Screen name="FertilizerDetails" component={FertilizerDetails} />
      <Stack.Screen name="MedicationDetails" component={MedicationDetails} />
      <Stack.Screen name="EquipmentDetails" component={EquipmentDetails} />
      <Stack.Screen name="SoilMonitoringInstructions" component={SoilMonitoringInstructions} />
      <Stack.Screen name="SoilDataDisplay" component={SoilDataDisplay} />
      <Stack.Screen name="DiagnosisHistory" component={DiagnosisHistoryScreen} />
      <Stack.Screen name="DiagnosisResult" component={DiagnosisResult} />
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="FeedbackForm" component={FeedbackForm} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      
    </Stack.Navigator>
  );
}
