# Research Summary & Key Findings

## Overview
Based on rapid domain research into Modern Yard Management Systems and Palm Oil Quality Control standards, the user's vision for an unloading monitor aligns perfectly with modern "Field-friendly" data architectures.

## Key Recommendations
1. **Next.js + Supabase**: Strongly suggested to provide the seamless Realtime WebSocket updates required by the TV dashboard without needing complex manual polling logic.
2. **TV Pagination UX**: TV layouts must restrict the number of visible rows to guarantee readability (large fonts) and prevent hardware crashes due to memory leaks from continuous intervals. 
3. **Dwell Time Automation**: Rather than manual entry of times, the system must automatically capture timestamps exactly when a state transitions (`Pending` -> `Bongkar` -> `Completed`) to ensure reporting accuracy.

## Confidence Levels
- **Stack**: HIGH (Next.js is standard for this profile)
- **Features**: HIGH (FFA, Moisture, KA, KK are standard indices)
- **Mitigating TV Hardware Constraints**: HIGH (React best practices applied)

*Research complete. Ready to proceed to requirements definition.*
