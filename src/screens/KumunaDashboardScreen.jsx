import React, { useEffect, useState } from "react";
import {
  Divider,
  Input,
  Layout,
  List,
  ListItem,
  Button,
  Text,
  Icon,
  Spinner,
} from "@ui-kitten/components";
import * as backendService from "../services/backendService";
import * as fileSystemService from "../services/fileSystemService";
import FloatButton from "../components/FloatButton";
import { StyleSheet } from "react-native";
import KumunaCard from "../components/KumunaCard";
import { getShortMonthName } from "../utils/DateUtils";
import * as yup from "yup";
import Toast from "react-native-toast-message";
import { FloatingAction } from "react-native-floating-action";

const ACTIONS = [
  {
    text: "Change image",
    icon: require("../../assets/image.png"),
    name: "change_image",
    position: 1,
    color: "#4dabf5",
    textBackground: "transparent",
    textColor: "#ffffff",
  },
];


export default function ({ route, navigation }) {
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [isLoadingMemberships, setLoadingMemberships] = useState(true);
  const [isLoadingMemberAddition, setLoadingMemberAddition] = useState(false);
  const [kumunaMemberships, setKumunaMemberships] = useState([]);
  const { kumuna } = route.params;
  const validationSchemes = {
    emailAddress: yup.string().email().required(),
  };
  const [errors, setErrors] = useState({});

  const loadKumunaMembers = async () => {
    setLoadingMemberships(true);
    const kumunaMemberships = await backendService.getKumunaMembers(kumuna.id);
    kumunaMemberships.forEach((m) => (m.createdTime = new Date(m.createdTime)));
    setKumunaMemberships(kumunaMemberships);
    setLoadingMemberships(false);
  };

  useEffect(() => {
    loadKumunaMembers();
  }, []);

  const renderMember = ({ item }) => {
    const createdTime = item.createdTime;
    return (
      <ListItem
        title={item.user.displayName}
        key={item.user.id}
        description={`${item.role
          .toLowerCase()
          .capitalize()}, joined at ${getShortMonthName(
          createdTime
        )}, ${createdTime.getDate()}`}
        accessoryLeft={(props) => <Icon name="person" {...props} />}
      />
    );
  };

  const validateField = (fieldName, newVal) => {
    let isValid = false;
    try {
      validationSchemes[fieldName].validateSync(newVal);
      delete errors[fieldName];
      isValid = true;
    } catch (e) {
      errors[fieldName] = e.errors[0];
    }
    setErrors({ ...errors });

    return isValid;
  };

  const addMember = async () => {
    if (!validateField("emailAddress", newMemberEmail)) {
      return;
    }

    setLoadingMemberAddition(true);
    try {
      await backendService.addMemberToKumuna(kumuna.id, newMemberEmail, "USER");
      setNewMemberEmail("");
      loadKumunaMembers();
      Toast.show({
        text1: "Got it 😄",
        text2: "You have invited a new member",
      });
    } catch (e) {
      Toast.show({
        text1: "Oops",
        text2: e.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoadingMemberAddition(false);
    }
  };

  const changeImage = async () => {
    const imageAsBlob = await fileSystemService.pickJpegImageAsBlob();
    if (imageAsBlob === null) {
      return;
    }

    const imagePath = await backendService.uploadKumunaImage(
      kumuna.name,
      imageAsBlob
    );

    backendService.updateKumuna(kumuna, imagePath);
  };

  return (
    <Layout style={styles.container}>
      <Layout style={styles.header}>
        <KumunaCard kumuna={kumuna} />
      </Layout>
      <Layout style={styles.main}>
        <Text category="h5">Members</Text>
        <Divider style={styles.divider} />
        <List
          showsVerticalScrollIndicator={true}
          style={{ maxHeight: 200, backgroundColor: "transparent" }}
          data={kumunaMemberships}
          refreshing={isLoadingMemberships}
          onRefresh={loadKumunaMembers}
          renderItem={renderMember}
        />
        <Text category="h6" style={styles.divider}>
          Add a member
        </Text>
        <Divider style={styles.divider} />
        <Input
          style={styles.input}
          label="Email address"
          keyboardType="email-address"
          returnKeyType="done"
          value={newMemberEmail}
          onChangeText={setNewMemberEmail}
          placeholder="example@example.com"
          editable={isLoadingMemberAddition}
          status={errors.emailAddress ? "danger" : "basic"}
          caption={errors.emailAddress ? errors.emailAddress : ""}
        />
        <Button
          style={styles.input}
          status="basic"
          onPress={addMember}
          disabled={isLoadingMemberAddition}>
          {isLoadingMemberAddition ? (
            <Spinner status="success" />
          ) : (
            "Add member"
          )}
        </Button>
      </Layout>
      <FloatButton
        onPress={() => navigation.navigate("KumunaListScreen")}
        filled={false}
        bottom={false}
        right={false}
        icon="arrow-back-outline"
      />
      <FloatingAction
        actions={ACTIONS}
        onPressItem={(actionName) => {
          if (actionName === "change_image") {
            changeImage();
          } else {
            Toast.show({
              text1: "Oops",
              text2: "Our bad. This action is not supported yet",
              type: "error",
            });
          }
        }}
        color="#4dabf5"
        overlayColor="transparent"
        floatingIcon={require("../../assets/more.png")}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    maxHeight: 250,
  },
  main: {
    flex: 3,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  divider: {
    marginTop: 10,
  },
  input: {
    marginTop: 10,
  },
});
