# Data Export Feature

This document describes the data export functionality that has been added to the Financial Budget App.

## Overview

The export feature allows users to export their financial data (transactions and budgets) to CSV or Excel (XLSX) formats and share them via the device's native sharing capabilities.

## Features

### Export Formats
- **CSV**: Plain text format compatible with spreadsheet applications
- **XLSX**: Microsoft Excel format with multiple sheets and metadata

### Data Types
- **Transactions**: Individual financial transactions with account information
- **Budgets**: Budget categories with spending progress

### Filtering Options
- **Date Range**: Filter transactions by start and end dates
- **Accounts**: Select specific accounts to include
- **Categories**: Filter by transaction/budget categories

### File Features

#### CSV Files
- Header comments with export metadata
- Properly quoted fields
- Combined transaction and budget data

#### XLSX Files
- Multiple sheets (Export Info, Transactions, Budgets)
- Export summary with metadata
- Formatted data with proper headers
- Workbook properties

## Usage

### Accessing Export Feature
1. Navigate to Settings screen
2. Tap on "Export Data"
3. Configure export options
4. Tap "Export Data" button
5. Choose to share the generated file

### Export Options
- **Format**: Choose between CSV or XLSX
- **Data Types**: Toggle transactions and/or budgets
- **Date Range**: Set start and end dates (for transactions)
- **Account Filter**: Select specific accounts
- **Category Filter**: Choose categories to include

## Technical Implementation

### Services
- `ExportService`: Core export functionality
  - Data filtering and transformation
  - File generation (CSV/XLSX)
  - Sharing functionality
  - Temporary file cleanup

### Components
- `ExportScreen`: Main export interface
- `SettingsScreen`: Entry point to export feature

### Dependencies
- `papaparse`: CSV generation
- `xlsx`: Excel file generation
- `react-native-fs`: File system operations
- `react-native-share`: Native sharing capabilities

### Data Transformation

#### Transaction Export Format
- Date (formatted)
- Description
- Category
- Amount (currency formatted)
- Type (income/expense)
- Account Name

#### Budget Export Format
- Category
- Budgeted Amount (currency formatted)
- Spent Amount (currency formatted)
- Remaining Amount (calculated)
- Progress % (calculated)
- Period (monthly/yearly)
- Currency

### Localization
- Full internationalization support (English, Spanish, French)
- Localized date and currency formatting
- Translated UI labels and messages

## Error Handling
- File system permission errors
- Storage space issues
- Network/sharing errors
- User cancellation handling

## Testing
- Comprehensive unit tests for export service
- Data transformation validation
- Error scenario coverage
- UI component tests

## File Management
- Automatic cleanup of old export files
- Maintains only 5 most recent exports
- Temporary file storage in app documents directory
