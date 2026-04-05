# Fundamental

TODO

# Technical

## Technical indicator table


| Indicator                | Definition                | Simple Concept                               | Basic Equation |
|--------------------------|---------------------------|----------------------------------------------|---|
| [RSI](#rsi)              | Relative Strength Index   | Measures speed and change of price moves.    | $100 - \left[\frac{100}{1 + (\frac{\text{Avg Gain}}{\text{Avg Loss}})}\right]$ |
| [STOCH](#stock)          | Stochastic Oscillator     | Compares closing price to price range.       | $100 \times \left[\frac{\text{Current Close} - \text{Lowest Low}}{\text{Highest High} - \text{Lowest Low}}\right]$ |
| [STOCHRSI](#stockrsi)    | Stochastic RSI            | RSI applied to the Stochastic formula.       | $100 \times \left[\frac{\text{RSI Current} - \text{RSI Low}}{\text{RSI Hight} - \text{RSI Low}}\right]$ |
| [MACD](#macd)            | Moving Average Conv/Div   | Shows relationship between two EMAs.         | $12\text{-period EMA} - 26\text{-period EMA}$ |
| [ADX](#adx)              | Average Directional Index | Measures the overall strength of a trend.    | Mean of Directional Index ($DX$) over time |
| [Williams %R](#williams) | Williams Percent Range    | Measures overbought/oversold levels.         | $-100 \times \left[\frac{\text{Highest High} - \text{Close}}{\text{Highest High} - \text{Lowest Low}}\right]$ |
| [CCI](#cci)              | Commodity Channel Index   | Identifies new trends or extreme conditions. | $\frac{\text{Typical Price} - \text{Simple Moving Average}}{0.015 \times \text{Mean Deviation}}$ |
| [ATR](#atr)              | Average True Range        | Measures market volatility.                  | Moving average of the True Range ($TR$) |
| [High/Low](#high)        | High-Low Index            | Compares stocks at 52-week highs vs. lows.   | $[100 \times (\text{New Highs} / (\text{New Highs} + \text{New Lows}))]$ |
| [UO](#uo)                | Ultimate Oscillator       | Momentum captured across three timeframes.   | $100 \times \frac{(4 \times \text{Avg}_7) + (2 \times \text{Avg}_{14}) + \text{Avg}_{28}}{4 + 2 + 1}$ |
| [ROC](#roc)              | Rate of Change            | Measures percentage change in price.         | $100 \times \left[\frac{\text{Last Close} - \text{Closing n Price Ago}}{\text{Closing n Price Ago}}\right]$ |
| [Bull/Bear](#bull)       | Elder-Ray Index           | Measures buying/selling pressure vs EMA [1]  | Bull = High - EMA; Bear = Low - EMA |


[1] EMA: Exponential Moving Average



## Technical indicator list

### RSI <a id="stoch"></a>

* Acronym: Relative Strength Index.
* Meaning: Measures the speed and direction of change of price movements.
* Equation: $RSI = 100 - \left[ \frac{100}{1 + (\frac{\text{Avg Gain}}{\text{Avg Loss}})} \right]$

| Verb    | Place    | Comment |
| ---     | ---      | --- |
| Buy     | < 30     | Oversold |
| Neutral | 40 .. 60 | Normal behavior |
| Sell    | > 70     | Overbought |


### STOCH <a id="stoch"></a>

* Acronym: STOCHastic oscillator
* Meaning: Compares a closing price to its price range over a specific period.
* Equation: $\%K = \left( \frac{\text{Current Close} - \text{Lowest Low}}{\text{Highest High} - \text{Lowest Low}} \right) \times 100$

| Verb    | Place    | Comment |
| ---     | ---      | --- |
| Buy     | < 20     |   |
| Neutral | 40 .. 60 |   |
| Sell    | > 80     |   |


### STOCHRSI <a id="stochrsi"></a>

* Acronym: STOCHastic Relative Strength Index
* Meaning: An "indicator of an indicator." It applies the Stochastic formula to RSI values to increase sensitivity.
* Equation: $\frac{RSI_{\text{current}} - RSI_{\text{lowest}}}{RSI_{\text{highest}} - RSI_{\text{lowest}}}$

| Verb    | Place    | Comment |
| ---     | ---      | --- |
| Buy     | < 20     |   |
| Neutral | 45 .. 55 |   |
| Sell    | > 80     |   |

### MACD <a id="macd"></a>

* Acronym: Moving Average Convergence Divergence
* Meaning: Shows the relationship between two moving averages (usually 12 and 26 EMA).
* Equation: $12\text{ Period EMA} - 26\text{ Period EMA}$

| Verb    | Place | Comment |
| ---     | ---   | --- |
| Buy     | > 0   | Rising |
| Neutral | 0     | Flat momentum |
| Sell    | < 0   | Falling |

### ADX <a id="stoch"></a>

* Acronym: Average Directional Index
* Meaning: Measures trend strength, not direction.
* Equation: A smoothed average of the Positive (+DI) and Negative (-DI) directional indicators.
* Strong Trend: Above 25 (Your image is 28.521, confirming a strong downward trend).
   * Weak Trend/Neutral: Below 20.

| Verb   | Place | Comment |
| ---    | ---   | --- |
| Strong | > 25  | The movement is strong |
| Weak   | < 20  | The movement is weak |


### Williams %R <a id="williams"></a>

* Acronym: Williams Percentage Range
* Meaning: Similar to Stochastics but works on a negative scale.
* Equation: $\frac{\text{Highest High} - \text{Close}}{\text{Highest High} - \text{Lowest Low}} \times -100$

| Verb    | Place      | Comment |
| ---     | ---        | --- |
| Buy     | < -80      |   |
| Neutral | -40 .. -60 |   |
| Sell    | > -20      |   |

### CCI <a id="cci"></a>

* Acronym: Commodity Channel Index
* Meaning: Identifies new trends or extreme conditions.
* Equation: $\frac{\text{Price} - \text{Avg Price}}{0.015 \times \text{Mean Deviation}}$

| Verb    | Place     | Comment |
| ---     | ---       | --- |
| Buy     | > -100    | Crossing above |
| Neutral | -50 .. 50 |   |
| Sell    | < 100     |   |


### ATR <a id="atr"></a>

* Acronym: Average True Range
* Meaning: Measures market volatility (not direction).
* Equation: Average of [(High-Low), (High-Prev Close), (Low-Prev Close)].
* Cheat Sheet Values:
* High Value: High volatility (scary markets).
   * Low Value: Low volatility (calm markets, like your value of 48.30).

| Verb    | Place      | Comment |
| ---     | ---        | --- |
| High    | 1000 pesos | Scary markets |
| Neutral | 1% peso    | Normal volatility |
| Low     | 1 pesos    | Calm markets |

### High/Low <a id="atr"></a>

* Acronym: High-Low Index.
* Meaning: Gauges the prevailing market direction by comparing the number of assets reaching 52-week highs to those hitting 52-week lows.
* Equation: The record high percent is typically used, which is $\frac{\text{New Highs}}{\text{New Highs} + \text{New Lows}} \times 100$.

| Verb    | Place            | Comment |
|---------|------------------|---|
| Buy     | > 50 and rising  | Bullish trend; more new highs than lows |
| Neutral | Around 50        | Balanced market; indecision |
| Sell    | < 50 and falling | Bearish trend; more new lows than highs |


### UO <a id="uo"></a>

* Acronym: Ultimate Oscillator
* Meaning: A technical momentum indicator designed to combine short, intermediate, and long-term price action into one measurement to reduce false divergence signals.
* Equation: A weighted average of 7, 14, and 28-period buying pressure.
* Equation: $100 \times \left[ \frac{(4 \times \text{Avg}_7) + (2 \times \text{Avg}_{14}) + \text{Avg}_{28}}{4 + 2 + 1} \right]$ where each Average uses Buying Pressure (BP) divided by True Range (TR).

| Verb    | Place    | Comment |
|---------|----------|---|
| Buy     | < 30     | Oversold; look for bullish divergence |
| Neutral | 40 .. 60 | Midpoint (50) is the bull/bear dividing line |
| Sell    | > 70     | Overbought; look for bearish divergence |


### ROC <a id="roc"></a>

* Acronym: Rate of Change
* Meaning: The percentage change in price between the current price and $n$ periods ago.
* Equation: $\left( \frac{\text{Close} - \text{Close}_{n}}{\text{Close}_{n}} \right) \times 100$
* Cheat Sheet Values:

| Verb    | Place | Comment |
| ---     | ---   | --- |
| Buy     | > 0   | Rising above |
| Neutral | 0     |   |
| Sell    | < 0   | Falling below |


### Bull/Bear Power <a id="bull"></a>

* Meaning: Measures the power of buyers vs. sellers.
* Equation: $\text{High/Low} - \text{13 period EMA}$
* Cheat Sheet Values:
* Buy: Positive value.
   * Sell: Negative value (Your image is -73.70, indicating Bears are very strong).

| Verb    | Place | Comment |
| ---     | ---   | --- |
| Buy     | > 0   | Bulls are strong |
| Neutral | 0     |   |
| Sell    | < 0   | Bears are strong |

## Pivot Point, Support and Resistance

**Pivot Point**: The center line.

$$
PP = (High + Low + Close) ÷ 3
$$


**Clasic Resistance Levels** — Above the pivot.

$$
R1 = (2 × PP) − Low
R2 = PP + (High − Low)
R3 = High + 2(PP − Low)
$$

**Clasic Support Levels** — Below the pivot.

$$
S1 = (2 × PP) − High
S2 = PP − (High − Low)
S3 = Low − 2(High − PP)
$$

**Fibonacci Resistance Levels** — Above the pivot.

$$
R1 = PP + 0.382 × (High − Low)
R2 = PP + 0.618 × (High − Low)
R3 = PP + 1.618 × (High − Low)
$$

__Support Levels__ — Below the pivot.

$$
S1 = PP − 0.382 × (High − Low)
S2 = PP − 0.618 × (High − Low)
S3 = PP − 1.618 × (High − Low)
$$

## Candlestick Current Patterns

Current patterns are forming right now — the current monthly candle has not yet closed. The pattern is being identified in real time but is not confirmed. The final shape of the candle can still change before the month ends.


### Quick Candlestick Patterns Reference Table

| Pattern | Type | Signal |
|---|---|---|
| Harami Bullish | 2-candle | Bullish reversal |
| Harami Cross | 2-candle | Bullish reversal (stronger) |
| Three Outside Down | 3-candle | Bearish reversal |
| Thrusting Bearish | 2-candle | Bearish continuation |
| Three Outside Up | 3-candle | Bullish reversal |
| Doji Star Bearish | 2-candle | Bearish reversal |
| Engulfing Bearish | 2-candle | Bearish reversal |
| Belt Hold Bullish | 1-candle | Bullish reversal |
| Bullish Engulfing | 2-candle | Bullish reversal |
| Rising Three Methods | 5-candle | Bullish continuation |
| Harami Bearish | 2-candle | Bearish reversal |
| Harami Cross Bearish | 2-candle | Bearish reversal (stronger) |
| Deliberation Bearish | 3-candle | Bearish exhaustion |
| Gravestone Doji | 1-candle | Bearish rejection |

> On **monthly (1M) timeframes**, these patterns carry significantly more weight than on shorter timeframes — each candle represents a full month of price action.

### Reading the diagrams

```
 |      ← upper wick
███     ← RED/Bearish body (close < open)
 |      ← lower wick

 |      ← upper wick
[ ]     ← GREEN/Bullish body (close > open)
 |      ← lower wick

 |      ← upper wick
 —      ← DOJI (open ≈ close)
 |      ← lower wick
```


### Harami Bullish

**Potential bullish reversal** — Small green candle contained inside the
previous large red candle. Selling pressure is fading.

```text
 |
███
███  |
 |  [_]
     |
[1] [2]
```


### Harami Cross

**Stronger bullish reversal signal** — Same as Harami Bullish, but the second candle is a Doji (indecision).

```text
 |
███
███  |
 |   —
     |
[1] [2]
```


### Three Outside Down

**Strong bearish reversal** — Bullish candle, then a bearish candle that engulfs it, then a third candle confirming the drop.

```text
     |   |
 |  [ ] ███
[ ] [ ] ███
 |  ███  |
    ███
     |
[1] [2] [3]
```


### Thrusting Bearish

**Bearish continuation** — After a red candle, a green candle recovers but fails to reach even the midpoint of the previous body. Weak bounce.

```text
 |
███     |
███    [ ]
 |     [ ]
        |
[1]    [2]
        ↑
  doesn't reach midpoint
```


## Candlestick Completed Patterns


Completed patterns are patterns where all candles have already closed. The pattern is fully formed and confirmed. The number next to them (1, 2, 3) indicates how many months ago it completed.

### Three Outside Up

**Strong bullish reversal** — Bearish candle, then a bullish engulfing, then confirmation upward.

```text
         |
 |   |  [ ]
███ [ ] [ ]
███ [ ]  |
 |   |

[1] [2] [3]
```


### Doji Star Bearish

**Bearish reversal warning** — After an uptrend, a Doji appears with a gap up. Indecision at the top.

```text
        |
   |    —
  [ ]   |
  [ ]
   |
  [1]  [2]
\```

---

### Engulfing Bearish
**Strong bearish reversal** — A large red candle completely swallows the
previous green candle.

\```
    |
   ███
  [ ]███
  [ ] |
   |
  [1][2]
\```

---

### Belt Hold Bullish
**Bullish reversal** — Single strong green candle. Opens at the low (no
lower wick), closes near the high. Buyers in full control from the open.

\```
    |
   [ ]
   [ ]
   [ ]
   (no lower wick)
\```

---

### Bullish Engulfing
**Strong bullish reversal** — Large green candle completely engulfs the
previous red candle.

\```
      |
  |  [ ]
 ███ [ ]
  |   |

 [1] [2]
\```

---

### Rising Three Methods
**Bullish continuation** — Strong green candle, 3 small red candles that
stay within range, then another strong green breakout. The trend is just
resting.

\```
   |                   |
  [ ]  |  |  |        [ ]
  [ ] ███ ███ ███      [ ]
   |   |   |   |        |

  [1] [2] [3] [4]     [5]
\```

---

### Harami Bearish
**Potential bearish reversal** — Small red candle contained within a large
green candle. Buying momentum is weakening.

\```
   |
  [ ]
  [ ] |
   | ███
      |
  [1] [2]
\```

---

### Harami Cross Bearish
**Stronger bearish reversal signal** — Same as Harami Bearish but second
candle is a Doji.

\```
   |
  [ ]
  [ ] |
   |  —
      |
  [1] [2]
\```

---

### Deliberation Bearish
**Bearish exhaustion warning** — Three green candles, but each successive
candle is smaller. Bulls are losing momentum.

\```
        |
   |   [ ]
  [ ]  [ ] |
  [ ]   | [_]
   |       |

  [1]  [2] [3]
            ↑ small = hesitation
\```

---

### Gravestone Doji
**Strong bearish signal** — Long upper wick, almost no body, no lower wick.
 Price rallied but was completely rejected and closed at the low.

\```
   |
   |
   |
   —   ← tiny body at the bottom
   (no lower wick)
\```

---

## Quick Reference Table

| Pattern | Type | Signal |
|---|---|---|
| Harami Bullish | 2-candle | Bullish reversal |
| Harami Cross | 2-candle | Bullish reversal (stronger) |
| Three Outside Down | 3-candle | Bearish reversal |
| Thrusting Bearish | 2-candle | Bearish continuation |
| Three Outside Up | 3-candle | Bullish reversal |
| Doji Star Bearish | 2-candle | Bearish reversal |
| Engulfing Bearish | 2-candle | Bearish reversal |
| Belt Hold Bullish | 1-candle | Bullish reversal |
| Bullish Engulfing | 2-candle | Bullish reversal |
| Rising Three Methods | 5-candle | Bullish continuation |
| Harami Bearish | 2-candle | Bearish reversal |
| Harami Cross Bearish | 2-candle | Bearish reversal (stronger) |
| Deliberation Bearish | 3-candle | Bearish exhaustion |
| Gravestone Doji | 1-candle | Bearish rejection |

> On **monthly (1M) timeframes**, these patterns carry significantly more
weight than on shorter timeframes — each candle represents a full month of
price action.

▎ Note: The backslashes before the triple backticks (\```) are there to
escape them inside this code block. Remove the \ when you paste into your
blog so the code blocks render correctly.


# References

* [Investing.com: Step-by-Step Guide to Interpreting Technical Charts](https://www.investing.com/academy/analysis/interpreting-technical-charts-guide/)
