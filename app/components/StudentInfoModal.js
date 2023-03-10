import { StyleSheet, View, ScrollView } from "react-native";
import React from "react";
import { Modal } from "react-native";
import Button from "./Button";
import Center from "./Center";
import Avatar from "./Avatar";
import Text from "./Text";
import Card from "./Card";

export default function StudentInfoModal({ show, onClose, student }) {
  return (
    <Modal
      animationType='slide'
      visible={show}
      style={styles.modal}
      onRequestClose={() => {
        onClose();
      }}>
      {student && (
        <ScrollView style={styles.modalContent}>
          <Center style={{ marginTop: 20 }}>
            <Avatar size='lg' uri={student.imageUrl} />
          </Center>
          <Center>
            <Text as='header4' style={styles.text}>
              {student.name}
            </Text>
          </Center>
          <Card>
            <Text color='secondary' as='header6'>
              Name
            </Text>
            <Text as='paragraph' style={styles.text}>
              {student.name}
            </Text>
          </Card>
          <Card>
            <Text color='secondary' as='header6'>
              Address
            </Text>
            <Text as='paragraph' style={styles.text}>
              {student.address.name}
            </Text>
          </Card>
          <Card>
            <Text color='secondary' as='header6'>
              Filiere
            </Text>
            <Text as='paragraph' style={styles.text}>
              {student.filiere}
            </Text>
          </Card>
          <Card>
            <Text color='secondary' as='header6'>
              Phone
            </Text>
            <Text as='paragraph' style={styles.text}>
              {student.phone}
            </Text>
          </Card>
          <Button title='close' onPress={onClose} />
        </ScrollView>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {},
  modalContent: {
    height: "100%",
    paddingHorizontal: 20,
    paddingTop: 45,
  },
  text: {
    marginVertical: 7,
  },
});
