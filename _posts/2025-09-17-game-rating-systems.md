---
layout: distill
title: Understanding Rating Systems
date: 2025-09-17 12:00:00
description: Elo, Glicko, and Glicko-2 Explained
tags: games math
categories: fun english
featured: true
related_publications: true
giscus_comments: true
thumbnail: https://raw.githubusercontent.com/lesaf92/dota2_tournament_sim/main/static/aegis.png
bibliography: references.bib
authors:
  - name: Luiz Eugenio
    affiliations:
      name: Instituto Tecnológico de Aeronáutica
toc:
  - name: The Elo Rating System
  - name: Glicko and Glicko-2 Rating Systems
  - name: References
---

In the world of competitive games and sports, rating systems play a crucial role in measuring player or team skill levels, predicting match outcomes, and facilitating fair matchmaking. Among the most influential are the Elo rating system and its successors, Glicko and Glicko-2. These systems, rooted in statistical models, help quantify relative strengths in zero-sum games like chess, esports, and even traditional sports. In this blog post, we'll dive deep into how each system works, explore their mathematical foundations with equations, and examine real-world applications. Whether you're a data enthusiast, a gamer, or a sports analyst, understanding these can shed light on why your favorite team ranks where it does.

## The Elo Rating System

The Elo rating system, named after its creator Arpad Elo, a Hungarian-American physicist and chess master, was developed in the mid-20th century as an improvement over earlier methods like the Harkness system. It assumes that player performance is a normally distributed random variable, with the mean representing true skill inferred from wins, losses, and draws. Adopted by the United States Chess Federation (USCF) in 1960 and the World Chess Federation (FIDE) in 1970, Elo's method is self-correcting: points are transferred from the loser to the winner, ensuring ratings reflect relative strengths within a pool.

### Core Mathematics of Elo

At its heart, Elo predicts the expected outcome of a match based on rating differences and updates ratings accordingly.

- **Expected Score Calculation**: For two players A and B with ratings $ R_A $ and $ R_B $, the expected score $ E_A $ for player A (probability of winning, plus half a draw) is given by the logistic function:

  $$
  E_A = \frac{1}{1 + 10^{(R_B - R_A)/400}}
  $$

  Similarly, $ E_B = 1 - E_A $. The factor 400 is chosen so that a 400-point difference implies the higher-rated player has about a 91% chance of winning. An alternative formulation uses:

  $$
  E_A = \frac{Q_A}{Q_A + Q_B}, \quad \text{where} \quad Q_A = 10^{R_A/400}, \quad Q_B = 10^{R_B/400}
  $$

- **Rating Update**: After the game, player A's new rating $ R_A' $ is:

  $$
  R_A' = R_A + K \cdot (S_A - E_A)
  $$

  Here, $ S_A $ is the actual score (1 for win, 0.5 for draw, 0 for loss), and $ K $ is the "K-factor," which controls the magnitude of changes. Higher K values (e.g., 40 for new players) allow rapid adjustments, while lower ones (e.g., 10 for experts) stabilize ratings. Organizations like FIDE vary K based on rating and games played, such as $ K = 40 $ for beginners and $ K = 10 $ for those rated 2400+.

The USCF uses a dynamic K: $ K = \frac{800}{N_e + m} $, where $ N_e $ is the effective number of games rated, and $ m $ is games in the current tournament.

### Real-World Applications of Elo

Originally designed for chess, Elo has expanded far beyond. In esports, it's used for matchmaking in games like League of Legends (pre-Season 2), Overwatch (with seasonal adjustments), and Classic Tetris. It powers global power rankings, capturing regional strengths like NA vs. EU in League of Legends. In traditional sports, FIFA adopted Elo for men's and women's world rankings since 2018, and it's applied to American college football (via BCS from 1998–2013), Major League Baseball (by analyst Nate Silver), tennis (Universal Tennis Rating), and even chess boxing (requiring a minimum 1600 Elo for pros). Extensions incorporate margin of victory for more nuanced rankings in team sports. Its predictive power makes it superior for dynamic rankings, as seen in sports analytics where it evaluates dominance across fields like hockey or baseball.

## Glicko and Glicko-2 Rating Systems

Developed by statistician Mark Glickman in 1995, the Glicko system addresses Elo's limitations by incorporating "Ratings Deviation" (RD), a measure of rating reliability that increases with inactivity or inconsistent play. Glicko-2, an extension, adds "volatility" (σ) to model expected performance fluctuations. Both are public domain and assume ratings evolve over time, performing best with 5–10 games per rating period.

### Key Differences from Elo

Unlike Elo, which treats all ratings as equally reliable, Glicko uses RD to dampen updates when uncertainty is high (e.g., after long breaks). Glicko-2 further refines this with volatility, assuming strengths follow an auto-regressive normal process. This makes Glicko systems more adaptive for players with varying activity levels.

### Mathematics of Glicko

- **RD Update (Pre-Games)**: RD increases over time:

  $$
  RD = \min\left(\sqrt{RD_0^2 + c^2 t}, 350\right)
  $$

  where $ t $ is rating periods elapsed, and $ c \approx 34.6 $ (tuned so RD reaches 350 after ~100 periods).

- **Rating Update (Post-Games)**: For $ m $ games, new rating $ r $:

  $$
  r = r_0 + \frac{q}{\frac{1}{RD^2} + \frac{1}{d^2}} \sum_{i=1}^{m} g(RD_i)(s_i - E(s|r_0, r_i, RD_i))
  $$

  with $ q = \frac{\ln(10)}{400} $, $ g(RD_i) = \frac{1}{\sqrt{1 + \frac{3q^2(RD_i^2)}{\pi^2}}} $, and expected score $ E $ similar to Elo but adjusted by $ g $. Then, $ d^2 $ is the inverse of a sum involving variances, and new RD is $ RD' = \sqrt{\left(\frac{1}{RD^2} + \frac{1}{d^2}\right)^{-1}} $.

### Mathematics of Glicko-2

Glicko-2 builds on this with volatility. Key steps include computing variance $ v $ and delta $ \Delta $:

$$
v = \left[\sum_{j=1}^{m} g(\phi_j)^2 E(\mu, \mu_j, \phi_j)\{1 - E(\mu, \mu_j, \phi_j)\}\right]^{-1}
$$

$$
\Delta = v \sum_{j=1}^{m} g(\phi_j)\{s_j - E(\mu, \mu_j, \phi_j)\}
$$

where $ \phi $ is RD (scaled), $ \mu $ is rating, and functions $ g $ and $ E $ are analogous. Updates then incorporate σ for more precise volatility adjustments.

### Real-World Applications of Glicko and Glicko-2

Glicko shines in online environments with irregular play. It's used on chess platforms like Lichess and Chess.com, where RD stabilizes ratings for infrequent players. In esports, datDota employs Glicko-2 for Dota 2 team rankings, and Counter-Strike: Global Offensive (CS:GO) uses a variant for ranks, analyzing how volatility affects progression. Other games like Guild Wars 2 and World of Warcraft (pre-Elo shift) leverage it for matchmaking. Beyond gaming, adaptations evaluate sprinting performance in athletics or rank teams in volleyball and golf, treating matches as simultaneous for individual sports. Glicko-2's team abstractions extend to multiplayer scenarios, motivating competitive play through accurate ladders.

## Comparing Elo, Glicko, and Glicko-2

Elo is simple and effective for consistent competitors but ignores uncertainty. Glicko adds RD for better handling of inactivity, while Glicko-2's volatility makes it ideal for volatile performances. In practice, Elo suits stable environments like professional chess, whereas Glicko variants excel in dynamic online games.

## References

- [Elo Rating System - Wikipedia](https://en.wikipedia.org/wiki/Elo_rating_system)
- [Glicko Rating System - Wikipedia](https://en.wikipedia.org/wiki/Glicko_rating_system)
- [Global Power Rankings in Esports: The Rating System Explained](https://boostroyal.com/blog/global-power-rankings-in-esports-the-rating-system-explained/)
- [Elo Ratings: The Ultimate Sports Ranking System](https://dubstat.com/elo-ratings-the-ultimate-sports-ranking-system/)
- [Opinions on Elo-rating system and its usefulness?](https://www.reddit.com/r/datascience/comments/koa2r0/opinions_on_elorating_system_and_its_usefulness/)
- [Extension of the Elo rating system to margin of victory](https://www.sciencedirect.com/science/article/abs/pii/S0169207020300157)
- [How Elo Ratings Actually Work](https://zwischenzug.substack.com/p/how-elo-ratings-actually-work)
- [The Glicko system](https://www.glicko.net/glicko/glicko.pdf)
- [Glicko rating system: A new method of evaluating sprinting performance](https://eltiodeldato.medium.com/glicko-rating-system-a-new-method-of-evaluating-sprinting-performance-15b0bcb50318)
- [The Glicko-2 System and How it May Affect Ranks](https://www.reddit.com/r/GlobalOffensive/comments/fst5of/the_glicko2_system_and_how_it_may_affect_ranks/)
- [A COMPARISON OF RATING SYSTEMS FOR COMPETITIVE SPORTS](https://glicko.net/research/volleyball-FINAL.pdf)
- [We should use the Glicko rating system](https://lichess.org/forum/lichess-feedback/we-should-use-the-glicko-rating-system)
- [Rating Sports Teams - Maximizing A Generic System](https://towardsdatascience.com/rating-sports-teams-maximizing-a-generic-system-772144574a07/)
- [Glicko-2 Rating System: Bug or exploit?](https://chess.stackexchange.com/questions/1260/glicko-2-rating-system-bug-or-exploit)
- [Abstracting Glicko-2 for Team Games](https://rhetoricstudios.com/downloads/AbstractingGlicko2ForTeamGames.pdf)