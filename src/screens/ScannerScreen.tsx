import React, { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { recognizeJobCard } from "../services/ocrService";
import { getAllVehicles } from "../services/vehicleService";
import { extractVehicleFromText } from "../utils/extractModel";
import { addToHistory } from "../services/historyService";
import { COLORS } from "../constants/colors";
import { Vehicle } from "../types/vehicle";
import VehicleDetailsScreen from "./VehicleDetailsScreen";

export default function ScannerScreen() {
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={COLORS.primary} style={{ marginBottom: 16 }} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          Please allow camera access to scan job cards, or choose a photo from your gallery.
        </Text>

        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.galleryPermissionButton} onPress={() => pickImageFromGallery()}>
          <Ionicons name="image-outline" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.galleryPermissionButtonText}>Upload from Gallery</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Process OCR & Vehicle extraction for a given image URI
  const processImageUri = async (uri: string) => {
    try {
      setScanning(true);
      setPreviewUri(uri);

      // 1. Run Base64 Real OCR
      const extractedText = await recognizeJobCard(uri);
      console.log("OCR Result Text:\n", extractedText);

      // 2. Fetch all registered vehicles
      const vehicles = await getAllVehicles();

      // 3. Match vehicle from extracted text
      const vehicle = extractVehicleFromText(extractedText, vehicles);

      if (vehicle) {
        // Save to History
        await addToHistory(vehicle);

        Alert.alert(
          "Vehicle Identified! 🚗",
          `Found: ${vehicle.brand} ${vehicle.model} (${vehicle.variant})\n\nTap View Details to inspect technical specifications, parts catalog, and PMS schedule.`,
          [
            {
              text: "View Details",
              onPress: () => setSelectedVehicle(vehicle),
            },
          ]
        );
      } else {
        Alert.alert(
          "No Vehicle Found in Image ❌",
          "The uploaded photo does not contain a recognized vehicle job card or model name.\n\nPlease upload or scan a clear photo of a vehicle job card (e.g. Maruti Dzire, Hyundai Creta, Swift)."
        );
      }
    } catch (error) {
      console.log("OCR Processing Error:", error);
      Alert.alert("Error", "Failed to process image.");
    } finally {
      setScanning(false);
      setPreviewUri(null);
    }
  };

  // Capture photo from camera
  const captureJobCard = async () => {
    try {
      if (!cameraRef.current) return;
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) {
        await processImageUri(photo.uri);
      }
    } catch (error) {
      console.log("Camera capture error:", error);
      Alert.alert("Error", "Failed to capture image from camera.");
    }
  };

  // Pick photo from phone gallery
  const pickImageFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Gallery access is required to select job card photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        await processImageUri(selectedUri);
      }
    } catch (error) {
      console.log("Gallery pick error:", error);
      Alert.alert("Error", "Failed to select image from gallery.");
    }
  };

  // If vehicle identified, show full details page
  if (selectedVehicle) {
    return (
      <VehicleDetailsScreen
        vehicle={selectedVehicle}
        onBack={() => setSelectedVehicle(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      {/* Frame & Overlay Controls */}
      <View style={styles.overlay}>
        <View style={styles.top}>
          <Text style={styles.title}>Scan / Upload Job Card</Text>
          <Text style={styles.subtitle}>Align job card inside frame or pick from gallery</Text>
        </View>

        <View style={styles.frame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        <View style={styles.controlsRow}>
          {/* Gallery Button */}
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={pickImageFromGallery}
            disabled={scanning}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="image-outline" size={24} color="#FFF" />
            </View>
            <Text style={styles.controlLabel}>Gallery</Text>
          </TouchableOpacity>

          {/* Shutter Button */}
          <TouchableOpacity
            disabled={scanning}
            style={styles.captureButton}
            onPress={captureJobCard}
            activeOpacity={0.8}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>

          {/* Auto-OCR Indicator */}
          <View style={styles.controlBtn}>
            <View style={styles.iconCircleTransparent}>
              <Ionicons name="scan-outline" size={24} color="rgba(255,255,255,0.6)" />
            </View>
            <Text style={styles.controlLabelDim}>Real-OCR</Text>
          </View>
        </View>
      </View>

      {/* OCR Progress Loading Screen */}
      {scanning && (
        <View style={styles.loadingOverlay}>
          {previewUri && (
            <Image source={{ uri: previewUri }} style={styles.previewThumbnail} resizeMode="cover" />
          )}
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginBottom: 12 }} />
          <Text style={styles.loadingTitle}>Reading Job Card Text...</Text>
          <Text style={styles.loadingSubtitle}>Extracting vehicle model &amp; technical specifications</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },
  top: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    color: "#DDD",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },
  frame: {
    width: "84%",
    height: "44%",
    borderRadius: 18,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: "#2563EB",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justify.content: "space-around",
    width: "100%",
    paddingHorizontal: 30,
  },
  controlBtn: {
    alignItems: "center",
    width: 60,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleTransparent: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  controlLabel: {
    color: "#FFF",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
  },
  controlLabelDim: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 6,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  captureInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    borderColor: "#000",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.92)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  previewThumbnail: {
    width: 140,
    height: 140,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  loadingTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  loadingSubtitle: {
    color: "#94A3B8",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: COLORS.background,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
  galleryPermissionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 12,
    width: "100%",
  },
  galleryPermissionButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 15,
  },
});