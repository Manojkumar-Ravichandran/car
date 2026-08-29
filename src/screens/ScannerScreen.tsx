import {
    useRef,
    useState
} from "react";

import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import {
    CameraView,
    useCameraPermissions
} from "expo-camera";

import { recognizeJobCard } from "../services/ocrService";

import {
    getAllVehicles
} from "../services/vehicleService";

import {
    extractVehicleFromText
} from "../utils/extractModel";

import {
    addToHistory
} from "../services/historyService";

import { COLORS } from "../constants/colors";

export default function ScannerScreen() {
  const cameraRef = useRef<any>(null);

  const [permission, requestPermission] =
    useCameraPermissions();

  const [scanning, setScanning] =
    useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required
        </Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>
            Allow Camera
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const captureJobCard = async () => {
    try {
      if (!cameraRef.current) {
        return;
      }

      setScanning(true);

      const photo =
        await cameraRef.current.takePictureAsync({
          quality: 0.7
        });

      const extractedText =
        await recognizeJobCard(photo.uri);

      console.log(
        "OCR TEXT:",
        extractedText
      );

      const vehicles =
        await getAllVehicles();

      const vehicle =
        extractVehicleFromText(
          extractedText,
          vehicles
        );

      if (vehicle) {
        await addToHistory(vehicle);

        Alert.alert(
          "Vehicle Found",
          `${vehicle.brand} ${vehicle.model}`
        );
      } else {
        Alert.alert(
          "Vehicle Not Found",
          "Unable to identify the vehicle model from the job card."
        );
      }
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Unable to scan job card"
      );
    } finally {
      setScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      />

      <View style={styles.overlay}>
        <View style={styles.top}>
          <Text style={styles.title}>
            Scan Job Card
          </Text>

          <Text style={styles.subtitle}>
            Keep the vehicle details inside the frame
          </Text>
        </View>

        <View style={styles.frame} />

        <TouchableOpacity
          disabled={scanning}
          style={styles.captureButton}
          onPress={captureJobCard}
        >
          <View style={styles.captureInner} />
        </TouchableOpacity>

        {scanning && (
          <Text style={styles.processing}>
            Processing job card...
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },

  camera: {
    flex: 1
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 70
  },

  top: {
    alignItems: "center"
  },

  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700"
  },

  subtitle: {
    color: "#DDD",
    marginTop: 8
  },

  frame: {
    width: "85%",
    height: "45%",
    borderWidth: 2,
    borderColor: "#FFF",
    borderRadius: 18
  },

  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center"
  },

  captureInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    borderColor: "#000"
  },

  processing: {
    position: "absolute",
    bottom: 30,
    color: "#FFF"
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  permissionText: {
    marginBottom: 20
  },

  permissionButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "600"
  }
});