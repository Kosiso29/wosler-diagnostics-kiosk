# Wosler Diagnostics Kiosk

A patient check-in kiosk application built with Next.js for Wosler Diagnostics clinics. This touch-friendly interface allows patients to check in for their scheduled appointments using various identification methods.

## Features

- **Touch-optimized interface** designed for kiosk environments
- **Multiple check-in methods**:
  - Booking reference number
  - Health card number
  - Personal details (name, date of birth, phone number)
- **Identity verification** for security
- **Multiple appointment handling** for patients with several bookings
- **Automatic idle timeout** returns to home screen after 45 seconds of inactivity
- **Error handling** with appropriate user messaging
- **Responsive design** that works on various screen sizes

## User Flow

1. **Welcome Screen**: Patients tap anywhere to begin
2. **Mode Selection**: Choose between "Check In" (scheduled appointment) or "Walk-In" (coming soon)
3. **Check-In Options**: Select how to find your appointment
4. **Search**: Enter booking reference, health card, or personal details
5. **Verification**: Confirm identity with phone number or health card
6. **Confirmation**: Review appointment details and check in
7. **Success**: Confirmation screen with appointment details

## Technology Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Lucide React** icons

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd wosler-kiosk
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Testing Data

The application includes mock booking data for testing. You can use these test cases:

**Booking References:**
- \`530\`, \`531\`, \`123\` (today's appointments)
- \`532\`, \`124\` (tomorrow's appointments)
- \`533\`, \`125\` (May 30)

**Health Card Numbers:**
- \`ontario-8547961250-AB\` (Jane Doe)
- \`ontario-1234567890-CD\` (John Smith)
- \`ontario-9876543210-EF\` (Michael Johnson)

**Personal Details:**
- **Jane Doe**: DOB 1995-09-06, Phone +14587458796
- **John Smith**: DOB 1980-03-15, Phone +14161234567
- **Michael Johnson**: DOB 1975-11-22, Phone +14169876543

### Production Build

To create a production build:

\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
app/
├── api/slots/           # API routes for booking operations
├── check-in/           # Check-in flow pages
├── mode-select/        # Mode selection page
├── walk-in/           # Walk-in registration (coming soon)
├── layout.tsx         # Root layout
├── page.tsx           # Welcome/attract screen
└── globals.css        # Global styles

components/ui/          # shadcn/ui components
hooks/                 # Custom React hooks
├── use-idle-timer.ts  # Idle timeout functionality
\`\`\`

## Configuration

The application is configured for kiosk use with:
- 45-second idle timeout
- Touch-friendly button sizes (minimum 48px)
- High contrast colors for accessibility
- Error handling with automatic redirects
- Session storage for maintaining state during check-in flow

## License

This project is proprietary software for Wosler Diagnostics.
