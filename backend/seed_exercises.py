# Seed file for the initial exercise library data.
from app import app
from extensions import db
from models.exercise import Exercise


def seed_exercises():
    """Insert a starter set of exercises if the table is empty."""
    with app.app_context():
        if Exercise.query.first():
            print("Exercises already seeded.")
            return

        exercises = [
            {"name": "Bench Press", "muscle_group": "Chest", "difficulty": "Intermediate", "description": "Compound chest exercise performed on a flat bench."},
            {"name": "Incline Dumbbell Press", "muscle_group": "Chest", "difficulty": "Intermediate", "description": "Upper chest press using dumbbells on an incline bench."},
            {"name": "Push-Up", "muscle_group": "Chest", "difficulty": "Beginner", "description": "Bodyweight press that targets the chest and triceps."},
            {"name": "Pull-Up", "muscle_group": "Back", "difficulty": "Intermediate", "description": "Vertical pull that strengthens the upper back and lats."},
            {"name": "Lat Pulldown", "muscle_group": "Back", "difficulty": "Beginner", "description": "Machine-based vertical pull for the lats."},
            {"name": "Bent-Over Row", "muscle_group": "Back", "difficulty": "Intermediate", "description": "Classic row that builds the back and posture."},
            {"name": "Deadlift", "muscle_group": "Back", "difficulty": "Advanced", "description": "Full-body hinge movement that trains the posterior chain."},
            {"name": "Overhead Press", "muscle_group": "Shoulders", "difficulty": "Intermediate", "description": "Standing press for shoulder strength and stability."},
            {"name": "Lateral Raise", "muscle_group": "Shoulders", "difficulty": "Beginner", "description": "Isolation exercise for the side delts."},
            {"name": "Front Raise", "muscle_group": "Shoulders", "difficulty": "Beginner", "description": "Isolation movement for the front shoulders."},
            {"name": "Squat", "muscle_group": "Legs", "difficulty": "Intermediate", "description": "Compound lower-body movement for strength and size."},
            {"name": "Romanian Deadlift", "muscle_group": "Legs", "difficulty": "Intermediate", "description": "Hip hinge exercise targeting hamstrings and glutes."},
            {"name": "Walking Lunge", "muscle_group": "Legs", "difficulty": "Intermediate", "description": "Single-leg movement that improves balance and leg strength."},
            {"name": "Leg Press", "muscle_group": "Legs", "difficulty": "Beginner", "description": "Machine press for quads and glutes."},
            {"name": "Calf Raise", "muscle_group": "Legs", "difficulty": "Beginner", "description": "Isolation exercise for the lower calves."},
            {"name": "Bicep Curl", "muscle_group": "Arms", "difficulty": "Beginner", "description": "Isolation movement for the biceps."},
            {"name": "Hammer Curl", "muscle_group": "Arms", "difficulty": "Beginner", "description": "Neutral-grip curl that targets the forearms and biceps."},
            {"name": "Triceps Dip", "muscle_group": "Arms", "difficulty": "Intermediate", "description": "Bodyweight exercise for the triceps and chest."},
            {"name": "Skull Crusher", "muscle_group": "Arms", "difficulty": "Intermediate", "description": "Isolation exercise for the triceps."},
            {"name": "Plank", "muscle_group": "Core", "difficulty": "Beginner", "description": "Static core hold that improves trunk stability."},
            {"name": "Dead Bug", "muscle_group": "Core", "difficulty": "Beginner", "description": "Controlled core exercise that teaches core bracing."},
            {"name": "Mountain Climber", "muscle_group": "Core", "difficulty": "Intermediate", "description": "Dynamic core exercise that also raises the heart rate."},
            {"name": "Russian Twist", "muscle_group": "Core", "difficulty": "Beginner", "description": "Rotational core movement for obliques."},
            {"name": "Burpee", "muscle_group": "Full Body", "difficulty": "Intermediate", "description": "Full-body conditioning movement."},
            {"name": "Kettlebell Swing", "muscle_group": "Full Body", "difficulty": "Intermediate", "description": "Explosive hip movement that builds power and endurance."},
            {"name": "Jump Squat", "muscle_group": "Full Body", "difficulty": "Beginner", "description": "Plyometric squat for power and leg endurance."},
            {"name": "Farmer's Carry", "muscle_group": "Full Body", "difficulty": "Beginner", "description": "Loaded carry that strengthens grip and posture."},
            {"name": "Glute Bridge", "muscle_group": "Glutes", "difficulty": "Beginner", "description": "Hip extension movement for the glutes and hamstrings."},
            {"name": "Hip Thrust", "muscle_group": "Glutes", "difficulty": "Intermediate", "description": "Weighted hip extension for glute strength."},
            {"name": "Step-Up", "muscle_group": "Glutes", "difficulty": "Beginner", "description": "Single-leg leg exercise that targets glutes and quads."},
        ]

        for payload in exercises:
            db.session.add(Exercise(**payload))

        db.session.commit()
        print("Seeded exercises successfully.")


if __name__ == "__main__":
    seed_exercises()
