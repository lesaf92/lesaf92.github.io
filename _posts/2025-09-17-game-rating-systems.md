---
layout: distill
title: Understanding Rating Systems
date: 2025-09-17 12:00:00
description: Elo, Glicko, and Glicko-2 Explained
tags: dota2 math
categories: games english
featured: true
related_publications: true
giscus_comments: true
thumbnail: https://raw.githubusercontent.com/lesaf92/dota2_tournament_sim/main/static/aegis.png
bibliography: rating_systems.bib
authors:
  - name: Luiz Eugenio
    affiliations:
      name: Instituto Tecnológico de Aeronáutica
toc:
  - name: The Elo Rating System
  - name: Glicko and Glicko-2 Rating Systems
  - name: Rating Systems in Dota 2
---

In the world of competitive games and sports, rating systems play a crucial role in measuring player or team skill levels, predicting match outcomes, and facilitating fair matchmaking. Among the most influential are the Elo rating system and its successors, Glicko and Glicko-2. These systems, rooted in statistical models, help quantify relative strengths in zero-sum games like chess, esports, and even traditional sports. In this blog post, we'll dive deep into how each system works, explore their mathematical foundations with equations, and examine real-world applications, including their specific use in Dota 2 for player MMR and team rankings. Whether you're a data enthusiast, a gamer, or a sports analyst, understanding these can shed light on why your favorite team ranks where it does.

## The Elo Rating System

The Elo rating system, named after its creator Arpad Elo, a Hungarian-American physicist and chess master, was developed in the mid-20th century as an improvement over earlier methods like the Harkness system.<d-cite key="elo_wikipedia"></d-cite> It assumes that player performance is a normally distributed random variable, with the mean representing true skill inferred from wins, losses, and draws. Adopted by the United States Chess Federation (USCF) in 1960 and the World Chess Federation (FIDE) in 1970, Elo's method is self-correcting: points are transferred from the loser to the winner, ensuring ratings reflect relative strengths within a pool.

### Core Mathematics of Elo

At its heart, Elo predicts the expected outcome of a match based on rating differences and updates ratings accordingly.

- **Expected Score Calculation**: For two players A and B with ratings $ R_A $ and $ R_B $, the expected score $ E_A $ for player A (probability of winning, plus half a draw) is given by the logistic function:

  $$
  E_A = \frac{1}{1 + 10^{(R_B - R_A)/400}}
  $$

  Similarly, $ E_B = 1 - E_A $. The factor 400 is chosen so that a 400-point difference implies the higher-rated player has about a 91% chance of winning.<d-cite key="elo_wikipedia"></d-cite> An alternative formulation uses:

  $$
  E_A = \frac{Q_A}{Q_A + Q_B}, \quad \text{where} \quad Q_A = 10^{R_A/400}, \quad Q_B = 10^{R_B/400}
  $$

- **Rating Update**: After the game, player A's new rating $ R_A' $ is:

  $$
  R_A' = R_A + K \cdot (S_A - E_A)
  $$

  Here, $ S_A $ is the actual score (1 for win, 0.5 for draw, 0 for loss), and $ K $ is the "K-factor," which controls the magnitude of changes. Higher K values (e.g., 40 for new players) allow rapid adjustments, while lower ones (e.g., 10 for experts) stabilize ratings.<d-cite key="elo_wikipedia"></d-cite> Organizations like FIDE vary K based on rating and games played, such as $ K = 40 $ for beginners and $ K = 10 $ for those rated 2400+.

The USCF uses a dynamic K: $ K = \frac{800}{N_e + m} $, where $ N_e $ is the effective number of games rated, and $ m $ is games in the current tournament.<d-cite key="elo_wikipedia"></d-cite>

### Real-World Applications of Elo

Originally designed for chess, Elo has expanded far beyond. In esports, it's used for matchmaking in games like League of Legends (pre-Season 2), Overwatch (with seasonal adjustments), and Classic Tetris.<d-cite key="boostroyal_esports"></d-cite><d-cite key="elo_wikipedia"></d-cite> It powers global power rankings, capturing regional strengths like NA vs. EU in League of Legends.<d-cite key="boostroyal_esports"></d-cite> In traditional sports, FIFA adopted Elo for men's and women's world rankings since 2018, and it's applied to American college football (via BCS from 1998–2013), Major League Baseball (by analyst Nate Silver), tennis (Universal Tennis Rating), and even chess boxing (requiring a minimum 1600 Elo for pros).<d-cite key="zwischenzug_elo"></d-cite><d-cite key="elo_wikipedia"></d-cite> Extensions incorporate margin of victory for more nuanced rankings in team sports.<d-cite key="sciencedirect_elo_extension"></d-cite> Its predictive power makes it superior for dynamic rankings, as seen in sports analytics where it evaluates dominance across fields like hockey or baseball.<d-cite key="dubstat_elo"></d-cite><d-cite key="reddit_datascience_elo"></d-cite>

## Glicko and Glicko-2 Rating Systems

Developed by statistician Mark Glickman in 1995, the Glicko system addresses Elo's limitations by incorporating "Ratings Deviation" (RD), a measure of rating reliability that increases with inactivity or inconsistent play.<d-cite key="glicko_wikipedia"></d-cite> Glicko-2, an extension, adds "volatility" (σ) to model expected performance fluctuations. Both are public domain and assume ratings evolve over time, performing best with 5–10 games per rating period.<d-cite key="glicko_net_glicko"></d-cite><d-cite key="glicko_wikipedia"></d-cite>

### Key Differences from Elo

Unlike Elo, which treats all ratings as equally reliable, Glicko uses RD to dampen updates when uncertainty is high (e.g., after long breaks). Glicko-2 further refines this with volatility, assuming strengths follow an auto-regressive normal process.<d-cite key="glicko_net_volleyball"></d-cite> This makes Glicko systems more adaptive for players with varying activity levels.

### Mathematics of Glicko

- **RD Update (Pre-Games)**: RD increases over time:

  $$
  RD = \min\left(\sqrt{RD_0^2 + c^2 t}, 350\right)
  $$

  where $ t $ is rating periods elapsed, and $ c \approx 34.6 $ (tuned so RD reaches 350 after ~100 periods).<d-cite key="glicko_wikipedia"></d-cite>

- **Rating Update (Post-Games)**: For $ m $ games, new rating $ r $:

  $$
  r = r_0 + \frac{q}{\frac{1}{RD^2} + \frac{1}{d^2}} \sum_{i=1}^{m} g(RD_i)(s_i - E(s|r_0, r_i, RD_i))
  $$

  with $ q = \frac{\ln(10)}{400} $, $ g(RD_i) = \frac{1}{\sqrt{1 + \frac{3q^2(RD_i^2)}{\pi^2}}} $, and expected score $ E $ similar to Elo but adjusted by $ g $. Then, $ d^2 $ is the inverse of a sum involving variances, and new RD is $ RD' = \sqrt{\left(\frac{1}{RD^2} + \frac{1}{d^2}\right)^{-1}} $.<d-cite key="glicko_wikipedia"></d-cite>

### Mathematics of Glicko-2

Glicko-2 builds on this with volatility. Key steps include computing variance $ v $ and delta $ \Delta $:

$$
v = \left[\sum_{j=1}^{m} g(\phi_j)^2 E(\mu, \mu_j, \phi_j)\{1 - E(\mu, \mu_j, \phi_j)\}\right]^{-1}
$$

$$
\Delta = v \sum_{j=1}^{m} g(\phi_j)\{s_j - E(\mu, \mu_j, \phi_j)\}
$$

where $ \phi $ is RD (scaled), $ \mu $ is rating, and functions $ g $ and $ E $ are analogous.<d-cite key="glicko_wikipedia"></d-cite> Updates then incorporate σ for more precise volatility adjustments.

### Real-World Applications of Glicko and Glicko-2

Glicko shines in online environments with irregular play. It's used on chess platforms like Lichess and Chess.com, where RD stabilizes ratings for infrequent players.<d-cite key="lichess_glicko"></d-cite><d-cite key="glicko_wikipedia"></d-cite> In esports, datDota employs Glicko-2 for Dota 2 team rankings, and Counter-Strike: Global Offensive (CS:GO) uses a variant for ranks, analyzing how volatility affects progression.<d-cite key="reddit_csgo_glicko2"></d-cite><d-cite key="glicko_wikipedia"></d-cite> Other games like Guild Wars 2 and World of Warcraft (pre-Elo shift) leverage it for matchmaking.<d-cite key="glicko_wikipedia"></d-cite> Beyond gaming, adaptations evaluate sprinting performance in athletics or rank teams in volleyball and golf, treating matches as simultaneous for individual sports.<d-cite key="medium_glicko_sprinting"></d-cite><d-cite key="glicko_net_volleyball"></d-cite><d-cite key="towardsdatascience_rating_teams"></d-cite> Glicko-2's team abstractions extend to multiplayer scenarios, motivating competitive play through accurate ladders.<d-cite key="rhetoricstudios_glicko2_team"></d-cite>

### Comparing Elo, Glicko, and Glicko-2

Elo is simple and effective for consistent competitors but ignores uncertainty. Glicko adds RD for better handling of inactivity, while Glicko-2's volatility makes it ideal for volatile performances. In practice, Elo suits stable environments like professional chess, whereas Glicko variants excel in dynamic online games.<d-cite key="glicko_wikipedia"></d-cite><d-cite key="chess_stack_glicko2"></d-cite>

## Rating Systems in Dota 2

While the core principles of Elo, Glicko, and Glicko-2 provide a universal framework for skill assessment, their adaptations in specific games like Dota 2 highlight how these systems evolve to meet the demands of massive multiplayer online battle arena (MOBA) environments. Dota 2, developed by Valve, has undergone significant changes to its matchmaking rating (MMR) system over the years, balancing competitive integrity, player retention, and computational efficiency. This section explores how Dota 2 has implemented (and iterated on) these systems for individual players and professional teams, drawing from historical transitions up to the current landscape in September 2025. We'll focus on MMR evolution for players and third-party team rankings, as Valve does not maintain an official team MMR.

### Player MMR: From Elo-Like Foundations to Glicko-Driven Matchmaking

Dota 2's matchmaking system, which pairs players for fair games, has always been inspired by Elo's zero-sum transfer of points based on expected vs. actual outcomes. Early iterations (pre-2013) used a basic Elo variant, where MMR was a hidden integer value starting around 1500, adjusted by a fixed amount per win/loss (typically ±25 MMR). This mirrored the Elo update equation:

$$
R' = R + K (S - E)
$$

with K often fixed at 32–40, leading to issues like MMR deflation (ratings drifting downward over time due to inconsistent play) and poor handling of new or inactive players.

By 2023, with Patch 7.33, Valve overhauled the system to adopt Glicko, a more sophisticated Bayesian approach that incorporates rating deviation (RD) to account for uncertainty.<d-cite key="hawk_dota_ranks"></d-cite><d-cite key="dotesports_dota_mmr"></d-cite><d-cite key="immortalboost_dota_glicko"></d-cite> This shift addressed Elo's limitations, such as over-penalizing streaks or failing to adjust for inactivity. Glicko estimates not just a player's rating (μ) but also its reliability via RD (φ), which widens with fewer games, reducing the impact of outliers. The expected score E now factors in RD:

$$
E = \frac{1}{\sqrt{1 + 3 q^2 \phi^2 / \pi^2}} \cdot \frac{1}{1 + 10^{(r_j - r_i)/400}}
$$

where q = ln(10)/400, and the g(φ) term dampens predictions for uncertain ratings.<d-cite key="hawk_dota_ranks"></d-cite> Post-match updates use a variance-weighted adjustment, converging faster for active players while stabilizing veterans.

As of September 2025, Dota 2's player MMR remains Glicko-based, integrated into a seasonal ranking structure introduced in 2024.<d-cite key="boostroyal_dota_updated"></d-cite><d-cite key="esportstales_dota_distribution"></d-cite><d-cite key="esportsinsider_dota_ranks"></d-cite><d-cite key="pickemmongolia_dota_mmr"></d-cite><d-cite key="ensigame_dota_rankings"></d-cite> Seasons reset medals (e.g., Herald to Immortal) but preserve hidden MMR, with visible tiers like:

| Tier     | MMR Range (Season 6, Aug 2025) |
|----------|--------------------------------|
| Herald   | 1–769                         |
| Guardian | 770–1539                      |
| Crusader | 1540–2309                     |
| Archon   | 2310–3079                     |
| Legend   | 3080–3849                     |
| Ancient  | 3850–4619                     |
| Divine   | 4620–5389                     |
| Immortal | 5390+                         |

Wins grant 20–30+ MMR (factoring behavior score and party size), while losses deduct similarly, modulated by RD for "confidence" in the rating—low-confidence players see smaller swings.<d-cite key="hawk_dota_ranks"></d-cite><d-cite key="boostroyal_dota_updated"></d-cite><d-cite key="immortalboost_dota_glicko"></d-cite> This prevents smurfing and rewards consistency, with ~1% of players in Immortal. Glicko also enables "calibration" matches for new accounts (10 games to set initial RD). Unlike full Glicko-2, Dota 2 omits explicit volatility (σ) to simplify for 10 million+ monthly users, though it implicitly handles variance through match history weighting.<d-cite key="dotesports_dota_mmr"></d-cite>

The evolution has improved matchmaking quality: Pre-Glicko, MMR inflation/deflation skewed queues; now, RD ensures balanced games even for returning players. Community feedback in 2025 praises the system's fairness, though debates persist on party MMR penalties.<d-cite key="reddit_dota_revamped"></d-cite>

### Team Rankings: Glicko-2 in Professional Dota 2 via datDota

For professional teams, Valve relies on community tools like datDota for Glicko-2 ratings, as official MMR is player-centric.<d-cite key="datdota_glicko2"></d-cite> datDota, a leading analytics site, applies Glicko-2 to aggregate team performance from ~100,000 pro matches, treating teams as entities with shared volatility.<d-cite key="datdota_glicko2"></d-cite><d-cite key="reddit_dota_ti_rating"></d-cite><d-cite key="gosugamers_dota_rankings"></d-cite> This extends the player model by averaging individual MMRs and factoring series outcomes (Bo3/Bo5), incorporating RD for roster changes and meta shifts.

Glicko-2's volatility (σ) is key here: It models how a team's strength fluctuates with patches (e.g., 7.37 in early 2025 buffed carries, spiking underdog wins).<d-cite key="facebook_wykrhm_ti2025"></d-cite><d-cite key="reddit_dota_ti_rating"></d-cite> Updates use the full formula:

$$
\Delta = v \sum g(\phi_j) (s_j - E)
$$

followed by σ and φ recalibration, with a rolling 6–12 month window for relevance.<d-cite key="datdota_glicko2"></d-cite> As of mid-2025, top teams like Team Falcons (1985+ Glicko-2) reflect post-TI dominance, with the event's average rating hitting a record 1935.5—making it the "toughest LAN ever."<d-cite key="facebook_wykrhm_ti2025"></d-cite><d-cite key="gosugamers_dota_rankings"></d-cite><d-cite key="datdota_glicko1"></d-cite>

These ratings inform bracket predictions, seeding, and betting, outperforming Elo in volatile metas. datDota's variants (Glicko-1, Elo-32/64) allow comparisons, but Glicko-2 is the gold standard for pros.<d-cite key="datdota_glicko1"></d-cite>

### Why These Systems Matter in Dota 2

Dota 2's adoption of Glicko for players and Glicko-2 for teams exemplifies iterative refinement: Elo provided the base, but uncertainty modeling via RD and σ ensures resilience against the game's 120+ heroes, patches, and team dynamics. As of 2025, no major overhauls are announced, but seasonal tweaks continue to refine confidence intervals.<d-cite key="pickemmongolia_dota_mmr"></d-cite> For aspiring analysts or our Dota 2 prediction project, these systems form the backbone—feeding features like rating diffs into neural nets for ~65% accurate win probs.