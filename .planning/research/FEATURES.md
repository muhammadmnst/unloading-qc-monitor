# Features Research: Palm Oil QC & Yard Management

## Table Stakes (Must-Have)
- **Parameter Validation**: CPO requires Free Fatty Acid (FFA) & Moisture tracking. PK/Cangkang require Kadar Air (KA), Kadar Kotoran (KK), and Stone tracking.
- **Status Workflow**: Gate In (Pending) -> Unloading (Bongkar) -> Completed.
- **Dwell Time Tracking**: The time difference between status updates to track bottleneck and operational efficiency.
- **Automated Public TV Display**: "10-foot experience" UI, high contrast, large fonts, auto-paginating through lists without user interaction.
- **Confidence**: **HIGH** (verified through standard CPO quality parameter research & TV UX best practices)

## Differentiating Features (Nice-to-Have)
- **Real-Time Websocket Updates**: TV screens update the moment QC clicks "Bongkar" without waiting for the next page cycle.
- **Color-coded Alerting**: Highlighting vehicles that exceed an SLA (e.g. > 2 hours in 'Bongkar' status).
- **Compliance Lock**: Forcing Operational staff to add a remark if unloading time is overly slow.
