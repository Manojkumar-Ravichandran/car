import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Vehicle } from "../types/vehicle";
import { COLORS } from "../constants/colors";

interface Props {
  vehicle: Vehicle;
  onBack: () => void;
}

type TabId = "specs" | "parts" | "pms" | "notes";

interface Tab {
  id: TabId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const TABS: Tab[] = [
  { id: "specs", label: "Specs", icon: "options-outline" },
  { id: "parts", label: "Parts Catalog", icon: "construct-outline" },
  { id: "pms", label: "PMS Schedule", icon: "calendar-outline" },
  { id: "notes", label: "Workshop Notes", icon: "create-outline" },
];

// ─── Spec Row ────────────────────────────────────────────────────────────────
function SpecRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
}) {
  return (
    <View style={styles.specRow}>
      <View style={styles.specLeft}>
        <Ionicons name={icon} size={18} color={COLORS.primary} />
        <Text style={styles.specLabel}>{label}</Text>
      </View>
      <Text style={styles.specValue}>{value || "N/A"}</Text>
    </View>
  );
}

// ─── Parts Row ───────────────────────────────────────────────────────────────
function PartsRow({ label, value }: { label: string; value?: string }) {
  if (!value || value.trim() === "") return null;
  return (
    <View style={styles.specRow}>
      <Text style={styles.partLabel}>{label}</Text>
      <Text style={styles.partValue}>{value}</Text>
    </View>
  );
}

// ─── Specs Tab ───────────────────────────────────────────────────────────────
function SpecsTab({ vehicle }: { vehicle: Vehicle }) {
  const ts = vehicle.technicalSpecifications;
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
      {/* Engine & Drivetrain */}
      <Text style={styles.sectionTitle}>Engine &amp; Drivetrain</Text>
      <View style={styles.card}>
        <SpecRow icon="settings-outline" label="Engine Code" value={vehicle.engineCode} />
        <View style={styles.divider} />
        <SpecRow icon="speedometer-outline" label="Engine Capacity" value={vehicle.engineCapacity} />
        <View style={styles.divider} />
        <SpecRow icon="flash-outline" label="Fuel Type" value={vehicle.fuelType} />
        <View style={styles.divider} />
        <SpecRow icon="swap-horizontal-outline" label="Transmission" value={vehicle.transmission} />
        <View style={styles.divider} />
        <SpecRow icon="car-outline" label="Drive Type" value={vehicle.driveType} />
        <View style={styles.divider} />
        <SpecRow icon="flag-outline" label="Country of Origin" value={vehicle.country} />
        <View style={styles.divider} />
        <SpecRow icon="layers-outline" label="Segment" value={vehicle.vehicleSegment} />
      </View>

      {/* Fluid Capacities & Grades */}
      <Text style={styles.sectionTitle}>Fluid Capacities &amp; Grades</Text>
      <View style={styles.card}>
        <SpecRow icon="water-outline" label="Engine Oil" value={ts ? `${ts.engineOilCapacity} (${ts.engineOilGrade})` : undefined} />
        {ts?.gearOilCapacity ? (
          <>
            <View style={styles.divider} />
            <SpecRow icon="git-branch-outline" label="Gear Oil" value={`${ts.gearOilCapacity} (${ts.gearOilGrade})`} />
          </>
        ) : null}
        <View style={styles.divider} />
        <SpecRow icon="thermometer-outline" label="Coolant" value={ts?.coolantCapacity} />
        <View style={styles.divider} />
        <SpecRow icon="shield-outline" label="Brake Fluid" value={ts?.brakeFluidType} />
        {ts?.powerSteeringOil ? (
          <>
            <View style={styles.divider} />
            <SpecRow icon="navigate-outline" label="Power Steering" value={ts.powerSteeringOil} />
          </>
        ) : null}
      </View>

      {/* Tyre & Electrical */}
      <Text style={styles.sectionTitle}>Tyre &amp; Electrical</Text>
      <View style={styles.card}>
        <SpecRow icon="radio-button-on-outline" label="Tyre Pressure (Front)" value={ts?.tyrePressureFront} />
        <View style={styles.divider} />
        <SpecRow icon="radio-button-on-outline" label="Tyre Pressure (Rear)" value={ts?.tyrePressureRear} />
        <View style={styles.divider} />
        <SpecRow icon="battery-charging-outline" label="Battery" value={ts?.batterySpecification} />
        {ts?.sparkPlugGap ? (
          <>
            <View style={styles.divider} />
            <SpecRow icon="flash-outline" label="Spark Plug Gap" value={ts.sparkPlugGap} />
          </>
        ) : null}
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// ─── Parts Tab ───────────────────────────────────────────────────────────────
function PartsTab({ vehicle }: { vehicle: Vehicle }) {
  const fp = vehicle.filtersAndParts;
  if (!fp) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="construct-outline" size={48} color={COLORS.border} />
        <Text style={styles.emptyText}>No parts data available</Text>
      </View>
    );
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Filters</Text>
      <View style={styles.card}>
        <PartsRow label="Oil Filter" value={fp.oilFilter} />
        {fp.airFilter ? <><View style={styles.divider} /><PartsRow label="Air Filter" value={fp.airFilter} /></> : null}
        {fp.cabinFilter ? <><View style={styles.divider} /><PartsRow label="Cabin Filter" value={fp.cabinFilter} /></> : null}
        {fp.fuelFilter ? <><View style={styles.divider} /><PartsRow label="Fuel Filter" value={fp.fuelFilter} /></> : null}
      </View>

      <Text style={styles.sectionTitle}>Drive &amp; Belt</Text>
      <View style={styles.card}>
        {fp.driveBeltNumber ? <PartsRow label="Drive Belt" value={fp.driveBeltNumber} /> : null}
        {fp.timingChain ? <><View style={styles.divider} /><PartsRow label="Timing Chain" value={fp.timingChain === "yes" ? "Yes (Chain Drive)" : "No"} /></> : null}
        {fp.timingBeltNumber && fp.timingBeltNumber.trim() !== "" ? <><View style={styles.divider} /><PartsRow label="Timing Belt" value={fp.timingBeltNumber} /></> : null}
        {fp.waterPumpPartNumber ? <><View style={styles.divider} /><PartsRow label="Water Pump" value={fp.waterPumpPartNumber} /></> : null}
      </View>

      <Text style={styles.sectionTitle}>Drain Parts</Text>
      <View style={styles.card}>
        {fp.drainPlugPartNumber ? <PartsRow label="Drain Plug" value={fp.drainPlugPartNumber} /> : null}
        {fp.drainWasherPartNumber ? <><View style={styles.divider} /><PartsRow label="Drain Washer" value={fp.drainWasherPartNumber} /></> : null}
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// ─── PMS Tab ─────────────────────────────────────────────────────────────────
function PmsTab({ vehicle }: { vehicle: Vehicle }) {
  const schedules = vehicle.pmsSchedule || [];
  const [selectedInterval, setSelectedInterval] = useState(
    schedules.length > 0 ? schedules[0].interval : 0
  );

  const selected = schedules.find((s) => s.interval === selectedInterval);

  if (schedules.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="calendar-outline" size={48} color={COLORS.border} />
        <Text style={styles.emptyText}>No PMS schedule available</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Interval Selector */}
      <View style={styles.intervalHeader}>
        <Text style={styles.intervalHeaderTitle}>Select Service Interval</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.intervalScroll}
        contentContainerStyle={styles.intervalScrollContent}
      >
        {schedules.map((s) => {
          const isActive = s.interval === selectedInterval;
          return (
            <TouchableOpacity
              key={s.interval}
              onPress={() => setSelectedInterval(s.interval)}
              style={[styles.intervalChip, isActive && styles.intervalChipActive]}
            >
              {isActive && (
                <Ionicons
                  name="checkmark"
                  size={13}
                  color="#fff"
                  style={{ marginRight: 4 }}
                />
              )}
              <Text style={[styles.intervalChipText, isActive && styles.intervalChipTextActive]}>
                PMS{s.interval} ({s.interval}k km)
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Service Items */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.tabContent}
      >
        <Text style={styles.sectionTitle}>Required Services &amp; Inspections</Text>
        {selected?.serviceItems.map((item, idx) => (
          <View key={idx} style={styles.serviceCard}>
            <View style={styles.serviceIconWrap}>
              <Ionicons
                name={
                  item.serviceName.toLowerCase().includes("oil")
                    ? "water-outline"
                    : item.serviceName.toLowerCase().includes("filter")
                    ? "funnel-outline"
                    : item.serviceName.toLowerCase().includes("brake")
                    ? "disc-outline"
                    : item.serviceName.toLowerCase().includes("spark")
                    ? "flash-outline"
                    : item.serviceName.toLowerCase().includes("battery")
                    ? "battery-charging-outline"
                    : item.serviceName.toLowerCase().includes("tyre")
                    ? "radio-button-on-outline"
                    : item.serviceName.toLowerCase().includes("coolant")
                    ? "thermometer-outline"
                    : "build-outline"
                }
                size={22}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{item.serviceName}</Text>
              <Text style={styles.serviceNote}>{item.notes}</Text>
            </View>
            <View style={styles.serviceRight}>
              <View
                style={[
                  styles.replaceBadge,
                  item.replacementRequired === "yes"
                    ? styles.replaceBadgeYes
                    : styles.replaceBadgeNo,
                ]}
              >
                <Text
                  style={[
                    styles.replaceBadgeText,
                    item.replacementRequired === "yes"
                      ? styles.replaceBadgeTextYes
                      : styles.replaceBadgeTextNo,
                  ]}
                >
                  {item.replacementRequired === "yes" ? "Replace" : "Inspect"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.gray} style={{ marginTop: 6 }} />
            </View>
          </View>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

// ─── Notes Tab ───────────────────────────────────────────────────────────────
function NotesTab({ vehicle }: { vehicle: Vehicle }) {
  const notes = vehicle.additionalNotes;
  if (!notes) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="create-outline" size={48} color={COLORS.border} />
        <Text style={styles.emptyText}>No workshop notes available</Text>
      </View>
    );
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
      {notes.specialNotes ? (
        <>
          <View style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <Ionicons name="star-outline" size={18} color="#F59E0B" />
              <Text style={[styles.noteTitle, { color: "#B45309" }]}>Special Notes</Text>
            </View>
            <Text style={styles.noteBody}>{notes.specialNotes}</Text>
          </View>
        </>
      ) : null}

      {notes.commonProblems ? (
        <View style={[styles.noteCard, styles.noteCardDanger]}>
          <View style={styles.noteHeader}>
            <Ionicons name="warning-outline" size={18} color="#DC2626" />
            <Text style={[styles.noteTitle, { color: "#DC2626" }]}>Common Problems</Text>
          </View>
          <Text style={styles.noteBody}>{notes.commonProblems}</Text>
        </View>
      ) : null}

      {notes.workshopInstructions ? (
        <View style={[styles.noteCard, styles.noteCardInfo]}>
          <View style={styles.noteHeader}>
            <Ionicons name="clipboard-outline" size={18} color={COLORS.primary} />
            <Text style={[styles.noteTitle, { color: COLORS.primary }]}>Workshop Instructions</Text>
          </View>
          <Text style={styles.noteBody}>{notes.workshopInstructions}</Text>
        </View>
      ) : null}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VehicleDetailsScreen({ vehicle, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("specs");

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />

      {/* ── Hero Header ── */}
      <View style={styles.hero}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.heroTitle}>
          {vehicle.brand} {vehicle.model}
        </Text>

        {/* Car Image */}
        <View style={styles.heroImageWrap}>
          {vehicle.vehicleImage ? (
            <Image
              source={{ uri: vehicle.vehicleImage + "?w=400&auto=format" }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="car" size={80} color="rgba(255,255,255,0.3)" />
          )}
        </View>

        {/* Variant & Year */}
        <View style={styles.heroMeta}>
          <Text style={styles.heroVariant}>{vehicle.variant}</Text>
          <Text style={styles.heroYear}>
            Year Model: {vehicle.year || vehicle.productionYear}
          </Text>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBar}
          contentContainerStyle={styles.tabBarContent}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabBtn, active && styles.tabBtnActive]}
              >
                <Ionicons
                  name={tab.icon}
                  size={18}
                  color={active ? "#fff" : "rgba(255,255,255,0.55)"}
                />
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
                {active && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Tab Content ── */}
      <View style={styles.body}>
        {activeTab === "specs" && <SpecsTab vehicle={vehicle} />}
        {activeTab === "parts" && <PartsTab vehicle={vehicle} />}
        {activeTab === "pms" && <PmsTab vehicle={vehicle} />}
        {activeTab === "notes" && <NotesTab vehicle={vehicle} />}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Hero ──
  hero: {
    backgroundColor: COLORS.secondary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
    paddingBottom: 0,
  },
  backBtn: {
    marginTop: 10,
    marginLeft: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
    marginLeft: 16,
  },
  heroImageWrap: {
    alignItems: "center",
    marginTop: 8,
    height: 100,
    justifyContent: "center",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: 100,
    opacity: 0.55,
  },
  heroMeta: {
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  heroVariant: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    fontWeight: "500",
  },
  heroYear: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginTop: 2,
  },

  // ── Tab Bar ──
  tabBar: {
    marginTop: 8,
  },
  tabBarContent: {
    paddingHorizontal: 10,
  },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 4,
    gap: 6,
    position: "relative",
  },
  tabBtnActive: {},
  tabLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontWeight: "500",
  },
  tabLabelActive: {
    color: "#fff",
    fontWeight: "700",
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 14,
    right: 14,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },

  // ── Body ──
  body: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // ── Section ──
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 4,
  },

  // ── Card ──
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },

  // ── Spec Row ──
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  specLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  specLabel: {
    color: COLORS.gray,
    fontSize: 14,
  },
  specValue: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 14,
    textAlign: "right",
    maxWidth: "50%",
  },

  // ── Parts ──
  partLabel: {
    color: COLORS.gray,
    fontSize: 14,
    flex: 1,
  },
  partValue: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },

  // ── PMS ──
  intervalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  intervalHeaderTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  intervalScroll: {
    maxHeight: 56,
  },
  intervalScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  intervalChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  intervalChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  intervalChipText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
  },
  intervalChipTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  serviceIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 3,
  },
  serviceNote: {
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 17,
  },
  serviceRight: {
    alignItems: "flex-end",
  },
  replaceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  replaceBadgeYes: {
    backgroundColor: "#FEF3C7",
  },
  replaceBadgeNo: {
    backgroundColor: "#F0FDF4",
  },
  replaceBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  replaceBadgeTextYes: {
    color: "#B45309",
  },
  replaceBadgeTextNo: {
    color: "#15803D",
  },

  // ── Notes ──
  noteCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  noteCardDanger: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  noteCardInfo: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  noteBody: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },

  // ── Empty ──
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 15,
  },
});
