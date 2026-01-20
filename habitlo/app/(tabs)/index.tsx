import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { getHabits, createHabit, checkInHabit } from "../../api/habits";

type Habit = {
  id: number;
  title: string;
  streak: number;
  lastCheckIn: string; // ISO string from Go backend
};

export default function App() {
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (err) {
      console.log("Error fetching habits", err);
    } finally {
      setLoading(false);
    }
  };
  const isCheckedInToday = (lastCheckIn: string) => {
    if (!lastCheckIn) return false;

    const today = new Date().toISOString().split("T")[0];
    const last = lastCheckIn.split("T")[0];

    return today === last;
  };

  const addHabit = async () => {
    if (!habit.trim()) return;

    try {
      const newHabit = await createHabit(habit);
      setHabits((prev) => [newHabit, ...prev]);
      setHabit("");
    } catch (err) {
      console.log("Error creating habit", err);
    }
  };

  const checkIn = async (id: number) => {
    try {
      const updated = await checkInHabit(id);
      setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
    } catch (err) {
      console.log("Error checking in", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HabitLo</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter habit name"
        value={habit}
        onChangeText={setHabit}
      />

      <Pressable
        style={[styles.button, !habit.trim() && { backgroundColor: "#8BC34A" }]}
        onPress={addHabit}
        disabled={!habit.trim()}
      >
        <Text style={styles.buttonText}>Add Habit</Text>
      </Pressable>

      {habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No habits yet 📝</Text>
          <Text style={styles.emptySubText}>
            Add your first habit to get started!
          </Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={loadHabits}
          refreshing={loading}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.habitTitle}>{item.title}</Text>

                {/* Last check-in label */}
                <Text style={styles.streak}>
                  {item.streak > 0
                    ? `🔥 ${item.streak}-day streak`
                    : "No streak yet"}
                </Text>

                <Text style={styles.lastCheckIn}>
                  {isCheckedInToday(item.lastCheckIn)
                    ? "Checked in today ✅"
                    : "Not checked in"}
                </Text>
              </View>

              <Pressable
                style={styles.checkInBtn}
                onPress={() => checkIn(item.id)}
              >
                <Text style={styles.checkInText}>Check In</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#fcfcfc",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    color: "#ffffff",
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  streak: {
    marginTop: 4,
    color: "#666",
  },
  checkInBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  checkInText: {
    color: "#fff",
    fontWeight: "600",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 14,
    color: "#666",
  },
  lastCheckIn: {
    marginTop: 4,
    color: "#999",
    fontSize: 12,
  },
});
