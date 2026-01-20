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

      <Pressable style={styles.button} onPress={addHabit}>
        <Text style={styles.buttonText}>Add Habit</Text>
      </Pressable>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ marginTop: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.habitTitle}>{item.title}</Text>
              <Text style={styles.streak}>🔥 {item.streak} day streak</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f9d6f9",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4fb0c8",
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
    backgroundColor: "#f9d6f9",
  },
});
