"use client"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { Grid } from "@visx/grid"
import { Group } from "@visx/group"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { Bar } from "@visx/shape"
import { Text } from "@visx/text"
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip"
import { Pie } from "@visx/shape"
import { localPoint } from "@visx/event"
import { GlyphCircle } from "@visx/glyph"
import { LinePath } from "@visx/shape"
import { curveMonotoneX } from "@visx/curve"
import { LegendOrdinal } from "@visx/legend"

// Define chart components
export function BarChart({
  data,
  index,
  categories,
  colors = ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444"],
  valueFormatter = (value) => value.toString(),
  yAxisWidth = 50,
  legend = { position: "bottom" },
  customTooltip,
  ...props
}) {
  const width = 800
  const height = 400
  const margin = { top: 40, right: 40, bottom: 50, left: yAxisWidth }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // Scales
  const xScale = scaleBand({
    domain: data.map((d) => d[index]),
    range: [0, innerWidth],
    padding: 0.3,
  })

  const yMax = Math.max(...data.map((d) => Math.max(...categories.map((c) => d[c] || 0))))

  const yScale = scaleLinear({
    domain: [0, yMax * 1.1],
    range: [innerHeight, 0],
    nice: true,
  })

  const colorScale = scaleOrdinal({
    domain: categories,
    range: colors,
  })

  // Tooltip
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: "white",
    color: "black",
  }

  return (
    <div style={{ position: "relative" }}>
      {legend.position === "top" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" shape="circle" />
        </div>
      )}
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} ref={containerRef} {...props}>
        <Group left={margin.left} top={margin.top}>
          <Grid
            xScale={xScale}
            yScale={yScale}
            width={innerWidth}
            height={innerHeight}
            stroke="#e0e0e0"
            strokeOpacity={0.2}
          />
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            tickFormat={(value) => value}
            stroke="#e0e0e0"
            tickStroke="#e0e0e0"
            tickLabelProps={() => ({
              fill: "#888888",
              fontSize: 12,
              textAnchor: "middle",
            })}
          />
          <AxisLeft
            scale={yScale}
            stroke="#e0e0e0"
            tickStroke="#e0e0e0"
            tickFormat={(value) => valueFormatter(value)}
            tickLabelProps={() => ({
              fill: "#888888",
              fontSize: 12,
              textAnchor: "end",
              dy: "0.33em",
              dx: "-0.33em",
            })}
          />
          {data.map((d) => {
            const x = xScale(d[index])
            const barWidth = xScale.bandwidth() / categories.length

            return categories.map((category, i) => {
              const value = d[category] || 0
              const barHeight = innerHeight - yScale(value)
              const barX = x + i * barWidth
              const barY = innerHeight - barHeight

              return (
                <Bar
                  key={`bar-${d[index]}-${category}`}
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={colorScale(category)}
                  onMouseLeave={() => {
                    hideTooltip()
                  }}
                  onMouseMove={(event) => {
                    const eventSvgCoords = localPoint(event)
                    showTooltip({
                      tooltipData: {
                        category,
                        value,
                        label: d[index],
                        payload: categories.map((c) => ({
                          name: c,
                          value: d[c] || 0,
                        })),
                      },
                      tooltipTop: eventSvgCoords?.y,
                      tooltipLeft: eventSvgCoords?.x,
                    })
                  }}
                />
              )
            })
          })}
        </Group>
      </svg>
      {tooltipOpen && (
        <TooltipInPortal key={Math.random()} top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          {customTooltip ? (
            customTooltip({ payload: tooltipData.payload, active: true })
          ) : (
            <div>
              <div style={{ fontWeight: "bold" }}>{tooltipData.label}</div>
              <div>
                {tooltipData.category}: {valueFormatter(tooltipData.value)}
              </div>
            </div>
          )}
        </TooltipInPortal>
      )}
      {legend.position === "bottom" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" shape="circle" />
        </div>
      )}
    </div>
  )
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444"],
  valueFormatter = (value) => value.toString(),
  yAxisWidth = 50,
  ...props
}) {
  const width = 800
  const height = 400
  const margin = { top: 40, right: 40, bottom: 50, left: yAxisWidth }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // Scales
  const xScale = scaleBand({
    domain: data.map((d) => d[index]),
    range: [0, innerWidth],
    padding: 0.3,
  })

  const yMax = Math.max(...data.map((d) => Math.max(...categories.map((c) => d[c] || 0))))

  const yScale = scaleLinear({
    domain: [0, yMax * 1.1],
    range: [innerHeight, 0],
    nice: true,
  })

  const colorScale = scaleOrdinal({
    domain: categories,
    range: colors,
  })

  // Tooltip
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: "white",
    color: "black",
  }

  return (
    <div style={{ position: "relative" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} ref={containerRef} {...props}>
        <Group left={margin.left} top={margin.top}>
          <Grid
            xScale={xScale}
            yScale={yScale}
            width={innerWidth}
            height={innerHeight}
            stroke="#e0e0e0"
            strokeOpacity={0.2}
          />
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            tickFormat={(value) => value}
            stroke="#e0e0e0"
            tickStroke="#e0e0e0"
            tickLabelProps={() => ({
              fill: "#888888",
              fontSize: 12,
              textAnchor: "middle",
            })}
          />
          <AxisLeft
            scale={yScale}
            stroke="#e0e0e0"
            tickStroke="#e0e0e0"
            tickFormat={(value) => valueFormatter(value)}
            tickLabelProps={() => ({
              fill: "#888888",
              fontSize: 12,
              textAnchor: "end",
              dy: "0.33em",
              dx: "-0.33em",
            })}
          />
          {categories.map((category) => {
            const lineData = data.map((d) => ({
              x: xScale(d[index]) + xScale.bandwidth() / 2,
              y: yScale(d[category] || 0),
              value: d[category] || 0,
              label: d[index],
            }))

            return (
              <Group key={`line-${category}`}>
                <LinePath
                  data={lineData}
                  x={(d) => d.x}
                  y={(d) => d.y}
                  stroke={colorScale(category)}
                  strokeWidth={2}
                  curve={curveMonotoneX}
                />
                {lineData.map((d, i) => (
                  <GlyphCircle
                    key={`point-${category}-${i}`}
                    left={d.x}
                    top={d.y}
                    size={64}
                    fill={colorScale(category)}
                    stroke="white"
                    strokeWidth={2}
                    onMouseLeave={() => {
                      hideTooltip()
                    }}
                    onMouseMove={(event) => {
                      const eventSvgCoords = localPoint(event)
                      showTooltip({
                        tooltipData: {
                          category,
                          value: d.value,
                          label: d.label,
                        },
                        tooltipTop: eventSvgCoords?.y,
                        tooltipLeft: eventSvgCoords?.x,
                      })
                    }}
                  />
                ))}
              </Group>
            )
          })}
        </Group>
      </svg>
      {tooltipOpen && (
        <TooltipInPortal key={Math.random()} top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div>
            <div style={{ fontWeight: "bold" }}>{tooltipData.label}</div>
            <div>
              {tooltipData.category}: {valueFormatter(tooltipData.value)}
            </div>
          </div>
        </TooltipInPortal>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" shape="line" />
      </div>
    </div>
  )
}

export function PieChart({
  data,
  index,
  categories,
  colors = ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444"],
  valueFormatter = (value) => value.toString(),
  ...props
}) {
  const width = 400
  const height = 400
  const margin = { top: 20, right: 20, bottom: 20, left: 20 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const radius = Math.min(innerWidth, innerHeight) / 2
  const centerX = innerWidth / 2
  const centerY = innerHeight / 2

  // Scales
  const colorScale = scaleOrdinal({
    domain: data.map((d) => d[index]),
    range: colors,
  })

  // Tooltip
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: "white",
    color: "black",
  }

  const pieData = data.map((d) => ({
    label: d[index],
    value: d[categories[0]],
  }))

  const total = pieData.reduce((acc, d) => acc + d.value, 0)

  return (
    <div style={{ position: "relative" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} ref={containerRef} {...props}>
        <Group top={centerY + margin.top} left={centerX + margin.left}>
          <Pie data={pieData} pieValue={(d) => d.value} outerRadius={radius} innerRadius={radius / 2} padAngle={0.01}>
            {(pie) => {
              return pie.arcs.map((arc, i) => {
                const [centroidX, centroidY] = pie.path.centroid(arc)
                const percentage = (arc.data.value / total) * 100
                return (
                  <g key={`arc-${i}`}>
                    <path
                      d={pie.path(arc) || ""}
                      fill={colorScale(arc.data.label)}
                      onMouseLeave={() => {
                        hideTooltip()
                      }}
                      onMouseMove={(event) => {
                        const eventSvgCoords = localPoint(event)
                        showTooltip({
                          tooltipData: {
                            label: arc.data.label,
                            value: arc.data.value,
                            percentage,
                          },
                          tooltipTop: eventSvgCoords?.y,
                          tooltipLeft: eventSvgCoords?.x,
                        })
                      }}
                    />
                    {percentage > 5 && (
                      <Text
                        x={centroidX}
                        y={centroidY}
                        textAnchor="middle"
                        verticalAnchor="middle"
                        fill="white"
                        fontSize={12}
                        fontWeight="bold"
                      >
                        {Math.round(percentage)}%
                      </Text>
                    )}
                  </g>
                )
              })
            }}
          </Pie>
        </Group>
      </svg>
      {tooltipOpen && (
        <TooltipInPortal key={Math.random()} top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div>
            <div style={{ fontWeight: "bold" }}>{tooltipData.label}</div>
            <div>{valueFormatter(tooltipData.value)}</div>
            <div>{Math.round(tooltipData.percentage)}%</div>
          </div>
        </TooltipInPortal>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" shape="circle" />
      </div>
    </div>
  )
}
