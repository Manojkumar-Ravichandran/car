import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Vehicle, ServiceItem } from "../types/vehicle";
import { COLORS } from "../constants/colors";

interface Props {
  vehicle: Vehicle;
  onBack: () => void;
}

type TabId = "specs" | "parts" | "pms" | "notes";

const TABS: { id: TabId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
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

// ─── Specs Content ───────────────────────────────────────────────────────────
function SpecsContent({ vehicle }: { vehicle: Vehicle }) {
  const ts = vehicle.technicalSpecifications;
  return (
    <View style={styles.tabContentPad}>
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

      <Text style={styles.sectionTitle}>Fluid Capacities &amp; Grades</Text>
      <View style={styles.card}>
        <SpecRow
          icon="water-outline"
          label="Engine Oil"
          value={ts ? `${ts.engineOilCapacity || ""} (${ts.engineOilGrade || ""})` : undefined}
        />
        {ts?.gearOilCapacity ? (
          <>
            <View style={styles.divider} />
            <SpecRow
              icon="git-branch-outline"
              label="Gear Oil"
              value={`${ts.gearOilCapacity} (${ts.gearOilGrade || ""})`}
            />
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
      <View style={{ height: 40 }} />
    </View>
  );
}

// ─── Parts Content ───────────────────────────────────────────────────────────
function PartsContent({ vehicle }: { vehicle: Vehicle }) {
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
    <View style={styles.tabContentPad}>
      <Text style={styles.sectionTitle}>Filters</Text>
      <View style={styles.card}>
        <PartsRow label="Oil Filter" value={fp.oilFilter} />
        {fp.airFilter ? (
          <>
            <View style={styles.divider} />
            <PartsRow label="Air Filter" value={fp.airFilter} />
          </>
        ) : null}
        {fp.cabinFilter ? (
          <>
            <View style={styles.divider} />
            <PartsRow label="Cabin Filter" value={fp.cabinFilter} />
          </>
        ) : null}
        {fp.fuelFilter ? (
          <>
            <View style={styles.divider} />
            <PartsRow label="Fuel Filter" value={fp.fuelFilter} />
          </>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>Drive &amp; Belt</Text>
      <View style={styles.card}>
        {fp.driveBeltNumber ? <PartsRow label="Drive Belt" value={fp.driveBeltNumber} /> : null}
        {fp.timingChain ? (
          <>
            <View style={styles.divider} />
            <PartsRow label="Timing Chain" value={fp.timingChain === "yes" ? "Yes (Chain Drive)" : "No"} />
          </>
        ) : null}
        {fp.timingBeltNumber && fp.timingBeltNumber.trim() !== "" ? (
          <>
            <View style={styles.divider} />
            <PartsRow label="Timing Belt" value={fp.timingBeltNumber} />
          </>
        ) : null}
        {fp.waterPumpPartNumber ? (
          <>
            <View style={styles.divider} />
            <PartsRow label="Water Pump" value={fp.waterPumpPartNumber} />
          </>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>Drain Parts</Text>
      <View style={styles.card}>
        {fp.drainPlugPartNumber ? <PartsRow label="Drain Plug" value={fp.drainPlugPartNumber} /> : null}
        {fp.drainWasherPartNumber ? (
          <>
            <View style={styles.divider} />
            <PartsRow label="Drain Washer" value={fp.drainWasherPartNumber} />
          </>
        ) : null}
      </View>
      <View style={{ height: 40 }} />
    </View>
  );
}

// ─── PMS Content ─────────────────────────────────────────────────────────────
function PmsContent({ vehicle }: { vehicle: Vehicle }) {
  const schedules = vehicle.pmsSchedule || [];
  const [selectedInterval, setSelectedInterval] = useState(
    schedules.length > 0 ? (schedules.find((s) => s.interval === 20)?.interval || schedules[0].interval) : 0
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

  // Calculate estimated total cost for selected interval
  const totalCost = selected?.serviceItems.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;

  return (
    <View style={{ flex: 1 }}>
      {/* Interval Header line: Select Service Interval + Est. Cost */}
      <View style={styles.intervalHeader}>
        <Text style={styles.intervalHeaderTitle}>Select Service Interval</Text>
        {totalCost > 0 && (
          <Text style={styles.estCostText}>
            Est. Cost: <Text style={styles.estCostValue}>₹{totalCost}</Text>
          </Text>
        )}
      </View>

      {/* Interval Chips */}
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
              activeOpacity={0.8}
            >
              {isActive && <Ionicons name="checkmark" size={14} color="#1D4ED8" style={{ marginRight: 4 }} />}
              <Text style={[styles.intervalChipText, isActive && styles.intervalChipTextActive]}>
                PMS{s.interval} ({s.interval}k km)
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Interval Description Yellow Banner */}
      {selected?.description ? (
        <View style={styles.intervalBanner}>
          <Text style={styles.intervalBannerText}>{selected.description}</Text>
        </View>
      ) : null}

      {/* Required Services & Inspections */}
      <View style={styles.tabContentPad}>
        <Text style={styles.sectionTitle}>Required Services &amp; Inspections</Text>
        {selected?.serviceItems.map((item, idx) => {
          const itemCategory = item.category || (item.replacementRequired === "yes" ? "Lubrication" : "Inspections");
          return (
            <View key={idx} style={styles.serviceCard}>
              <View style={styles.serviceIconWrap}>
                <Ionicons
                  name={
                    item.serviceName.toLowerCase().includes("oil filter") || item.serviceName.toLowerCase().includes("cabin") || item.serviceName.toLowerCase().includes("air filter")
                      ? "funnel-outline"
                      : item.serviceName.toLowerCase().includes("oil") || item.serviceName.toLowerCase().includes("fluid") || item.serviceName.toLowerCase().includes("coolant")
                      ? "water-outline"
                      : item.serviceName.toLowerCase().includes("brake")
                      ? "disc-outline"
                      : item.serviceName.toLowerCase().includes("spark")
                      ? "flash-outline"
                      : item.serviceName.toLowerCase().includes("battery")
                      ? "battery-charging-outline"
                      : item.serviceName.toLowerCase().includes("tyre")
                      ? "radio-button-on-outline"
                      : "build-outline"
                  }
                  size={22}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{item.serviceName}</Text>
                <Text style={styles.serviceMeta}>
                  {itemCategory} • Interval: {selectedInterval}k km
                </Text>
              </View>
              <View style={styles.serviceRight}>
                {item.cost && item.cost > 0 ? (
                  <View style={styles.costRow}>
                    <Text style={styles.costText}>₹{item.cost}</Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.gray} style={{ marginLeft: 4 }} />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.replaceBadge,
                      item.replacementRequired === "yes" ? styles.replaceBadgeYes : styles.replaceBadgeNo,
                    ]}
                  >
                    <Text
                      style={[
                        styles.replaceBadgeText,
                        item.replacementRequired === "yes" ? styles.replaceBadgeTextYes : styles.replaceBadgeTextNo,
                      ]}
                    >
                      {item.replacementRequired === "yes" ? "Replace" : "Inspect"}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </View>
    </View>
  );
}

// ─── Notes Content ───────────────────────────────────────────────────────────
function NotesContent({ vehicle }: { vehicle: Vehicle }) {
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
    <View style={styles.tabContentPad}>
      {notes.specialNotes ? (
        <View style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <Ionicons name="star-outline" size={18} color="#F59E0B" />
            <Text style={[styles.noteTitle, { color: "#B45309" }]}>Special Notes</Text>
          </View>
          <Text style={styles.noteBody}>{notes.specialNotes}</Text>
        </View>
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
      <View style={{ height: 40 }} />
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VehicleDetailsScreen({ vehicle, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("specs");
  const mainScrollRef = useRef<ScrollView>(null);

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />

      {/* Main Single ScrollView containing Hero + Sticky Tab Bar + Active Tab Content */}
      <ScrollView
        ref={mainScrollRef}
        style={styles.mainScrollView}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* ── Index 0: Hero Header (Car Image & Variant info) ── */}
        <View style={styles.heroContainer}>
          {/* Top Title Bar */}
          <View style={styles.headerBand}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.heroTitle} numberOfLines={1}>
              {vehicle.brand} {vehicle.model}
            </Text>

            <View style={{ width: 38 }} />
          </View>

          {/* Car Image Area */}
          <View style={styles.heroImageWrap}>
            {vehicle.vehicleImage ? (
              <Image
                source={{ uri: vehicle.vehicleImage + "?w=500&auto=format" }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="car" size={72} color="rgba(255,255,255,0.3)" />
            )}
          </View>

          {/* Variant & Year */}
          <View style={styles.heroMeta}>
            <Text style={styles.heroVariant} numberOfLines={1}>
              {vehicle.variant}
            </Text>
            <Text style={styles.heroYear}>
              Year Model: {vehicle.year || vehicle.productionYear}
            </Text>
          </View>
        </View>

        {/* ── Index 1: STICKY Tab Bar (Stays pinned at top when scrolling up on ANY tab) ── */}
        <View style={styles.stickyTabBarWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabBarContent}
            bounces={false}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => handleTabChange(tab.id)}
                  style={styles.tabBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={tab.icon}
                    size={16}
                    color={active ? "#fff" : "rgba(255,255,255,0.5)"}
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

        {/* ── Index 2: Active Tab Content (Scrolls under sticky tab bar) ── */}
        <View style={styles.body}>
          {activeTab === "specs" && <SpecsContent vehicle={vehicle} />}
          {activeTab === "parts" && <PartsContent vehicle={vehicle} />}
          {activeTab === "pms" && <PmsContent vehicle={vehicle} />}
          {activeTab === "notes" && <NotesContent vehicle={vehicle} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  mainScrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Hero ──
  heroContainer: {
    backgroundColor: COLORS.secondary,
    paddingBottom: 8,
  },
  headerBand: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "android" ? 4 : 0,
    paddingBottom: 6,
    backgroundColor: COLORS.secondary,
    justifyContent: "space-between",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginHorizontal: 6,
  },
  heroImageWrap: {
    width: "100%",
    height: 100,
    overflow: "hidden",
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  heroMeta: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4,
  },
  heroVariant: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontWeight: "500",
  },
  heroYear: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginTop: 2,
  },

  // ── Sticky Tab bar (Index 1) ──
  stickyTabBarWrap: {
    backgroundColor: COLORS.secondary,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tabBarContent: {
    paddingHorizontal: 8,
  },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 2,
    gap: 6,
    position: "relative",
  },
  tabLabel: {
    color: "rgba(255,255,255,0.5)",
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
    minHeight: 500,
  },
  tabContentPad: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
    marginBottom: 18,
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
  specLabel: { color: COLORS.gray, fontSize: 14 },
  specValue: { color: COLORS.text, fontWeight: "600", fontSize: 14, textAlign: "right", maxWidth: "50%" },

  // ── Parts ──
  partLabel: { color: COLORS.gray, fontSize: 14, flex: 1 },
  partValue: { color: COLORS.text, fontWeight: "600", fontSize: 14, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" },

  // ── PMS ──
  intervalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  intervalHeaderTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  estCostText: { fontSize: 14, color: COLORS.gray, fontWeight: "500" },
  estCostValue: { color: "#16A34A", fontWeight: "700" },

  intervalScroll: { maxHeight: 52 },
  intervalScrollContent: { paddingHorizontal: 16, gap: 8, alignItems: "center", paddingBottom: 6 },
  intervalChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  intervalChipActive: {
    backgroundColor: "#DBEAFE",
    borderColor: "#93C5FD",
  },
  intervalChipText: { fontSize: 13, color: COLORS.text, fontWeight: "500" },
  intervalChipTextActive: { color: "#1D4ED8", fontWeight: "700" },

  intervalBanner: {
    backgroundColor: "#FEFCE8",
    borderWidth: 1,
    borderColor: "#FEF08A",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    padding: 12,
  },
  intervalBannerText: {
    color: "#713F12",
    fontSize: 13,
    lineHeight: 18,
  },

  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 15, fontWeight: "700", color: COLORS.text, marginBottom: 3 },
  serviceMeta: { fontSize: 12, color: COLORS.gray },
  serviceRight: { alignItems: "flex-end", justifyContent: "center" },
  costRow: { flexDirection: "row", alignItems: "center" },
  costText: { fontSize: 14, fontWeight: "700", color: "#16A34A" },

  replaceBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  replaceBadgeYes: { backgroundColor: "#FEF3C7" },
  replaceBadgeNo: { backgroundColor: "#F0FDF4" },
  replaceBadgeText: { fontSize: 11, fontWeight: "700" },
  replaceBadgeTextYes: { color: "#B45309" },
  replaceBadgeTextNo: { color: "#15803D" },

  // ── Notes ──
  noteCard: { backgroundColor: "#FFFBEB", borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: "#FDE68A" },
  noteCardDanger: { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },
  noteCardInfo: { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" },
  noteHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  noteTitle: { fontSize: 15, fontWeight: "700" },
  noteBody: { fontSize: 14, color: COLORS.text, lineHeight: 22 },

  // ── Empty ──
  emptyState: { paddingVertical: 60, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyText: { color: COLORS.gray, fontSize: 15 },
});
