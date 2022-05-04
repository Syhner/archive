# Simulate a sports tournament

import csv
from sys import argv, exit
import random

# Number of simluations to run
N = 1000


def main():

    # Ensure correct usage
    if len(argv) != 2:
        exit("Usage: python tournament.py FILENAME")

    # Read teams into memory from file
    teams = []
    counts = {}
    filename = argv[1]

    with open(filename) as file:
        reader = csv.DictReader(file)
        for team in reader:
            team["rating"] = int(team["rating"])
            teams.append(team)
            counts[team["team"]] = 0

    # Simulate N tournaments and keep track of win counts
    for i in range(N):
        winner = simulate_tournament(teams)
        if winner in counts:
            counts[winner] += 1

    # Print each team's chances of winning, according to simulation
    for team in sorted(counts, key=lambda team: counts[team], reverse=True):
        print(f"{team}: {counts[team] * 100 / N:.1f}% chance of winning")


# Simulate a game. Return True if team1 wins, False otherwise
def simulate_game(team1, team2):
    rating1 = team1["rating"]
    rating2 = team2["rating"]
    probability = 1 / (1 + 10 ** ((rating2 - rating1) / 600))
    return random.random() < probability

# Returns list of winning teams
def simulate_round(teams):
    winners = []

    # Simulate games for all pairs of teams
    for i in range(0, len(teams), 2):
        if simulate_game(teams[i], teams[i + 1]):
            winners.append(teams[i])
        else:
            winners.append(teams[i + 1])

    return winners


# Returns name of winning teams.
def simulate_tournament(teams):
    while len(teams) > 1:
        teams = simulate_round(teams)
    return teams[0]["team"]


if __name__ == "__main__":
    main()
