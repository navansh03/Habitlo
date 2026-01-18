package main

import (
	"time"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Habit struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Streak      int       `json:"streak"`
	LastCheckIn time.Time `json:"lastCheckIn"`
}

var habits []Habit
var currentID = 1

func main() {
	app := fiber.New()

	// Allow Expo app to talk to backend
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// GET /habits
	app.Get("/habits", func(c *fiber.Ctx) error {
		return c.JSON(habits)
	})

	// POST /habits
	app.Post("/habits", func(c *fiber.Ctx) error {
		type Body struct {
			Title string `json:"title"`
		}

		var body Body
		if err := c.BodyParser(&body); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid body"})
		}

		habit := Habit{
			ID:          currentID,
			Title:       body.Title,
			Streak:      0,
			LastCheckIn: time.Time{},
		}

		currentID++
		habits = append(habits, habit)

		return c.JSON(habit)
	})

	// PATCH /habits/:id/checkin
	app.Patch("/habits/:id/checkin", func(c *fiber.Ctx) error {
		id, _ := strconv.Atoi(c.Params("id"))

		for i, h := range habits {
			if h.ID == id {
				today := time.Now().Format("2006-01-02")
				last := h.LastCheckIn.Format("2006-01-02")

				if today != last {
					habits[i].Streak += 1
					habits[i].LastCheckIn = time.Now()
				}

				return c.JSON(habits[i])
			}
		}

		return c.Status(404).JSON(fiber.Map{"error": "Habit not found"})
	})

	app.Listen(":8080")
}
