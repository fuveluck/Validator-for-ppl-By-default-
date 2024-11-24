<template>
  <div class="main-page">
    <!-- Main content with file upload and document actions -->
    <div class="content">
      <div class="left-content">
        <h2>Data Validator</h2>

        <!-- File input hidden, using an icon and text to trigger file upload for Document -->
        <label 
          for="file-upload" 
          class="upload-icon-text" 
          :class="{ 'uploaded': document }">
          <i class="fas fa-upload"></i> Upload a document
        </label>
        <input type="file" id="file-upload" @change="handleFileUpload" style="display: none;" />

        <!-- Add space between Upload and Instruction -->
        <div class="spacer"></div>

        <!-- File input hidden, using an icon and text to trigger file upload for Instruction -->
        <label 
          for="instruction-upload" 
          class="upload-icon-text" 
          :class="{ 'uploaded': instruction }">
          <i class="fas fa-file-alt"></i> Upload instruction (txt)
        </label>
        <input type="file" id="instruction-upload" @change="handleInstructionUpload" style="display: none;" />

        <!-- Add space between Instruction and Validate Document -->
        <div class="spacer-small"></div>

        <!-- Validate Button visible only when both document and instruction are uploaded -->
        <button 
          v-if="document && instruction" 
          @click="validateDocument" 
          class="action-button validate-btn">
          Validate Document
        </button>

        <!-- Buttons displayed after validation -->
        <div v-if="isValid" class="button-row">
          <!-- Preview Button -->
          <button @click="previewDocument" class="action-button preview-btn">Preview</button>
          <!-- Download Button -->
          <button @click="downloadDocument" class="action-button download-btn">Download</button>
        </div>
      </div>

      <!-- Right Sidebar for History -->
      <div class="sidebar">
        <h3>History</h3>
        <div v-for="(item, index) in history" :key="index" class="history-item">
          <a :href="item.url" target="_blank">{{ item.name }}</a>
          <!-- Feedback Section that appears if no feedback has been submitted -->
          <div v-if="!item.submittedFeedback">
            <input type="text" v-model="item.feedback" placeholder="Enter your feedback" />
            <button @click="submitFeedback(item)" class="action-button submit-btn">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      document: null, // Holds the currently uploaded document
      instruction: null, // Holds the uploaded instruction file
      isValid: false, // Whether the document is validated
      history: [], // Array to store uploaded documents and feedback links
      currentFileUrl: null, // URL of the current file for preview and download
    };
  },
  methods: {
    // Handle file upload for document
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.document = file;
        this.isValid = false; // Reset validation until user confirms
        this.currentFileUrl = URL.createObjectURL(file); // Create URL for file
      }
    },

    // Handle file upload for instruction
    handleInstructionUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.instruction = file; // Store the instruction file
      }
    },

    // Validate document, enabling the download and preview buttons
    validateDocument() {
      // Generate the content for the .txt file (based on the instruction and document)
      const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14); // Format: YYYYMMDDHHMMSS
      const txtContent = `Document Name: ${this.document.name}\nInstruction File: ${this.instruction.name}\nValidated at: ${timestamp}`;

      // Create the .txt file (simulating it being in the "output" folder)
      const blob = new Blob([txtContent], { type: "text/plain" });
      const fileUrl = URL.createObjectURL(blob); // Generate URL for the .txt file

      // Create the history entry with the new file URL
      this.history.push({
        name: "ZadanieDP.txt", // Static name as requested
        url: fileUrl, // The URL for preview and download
        feedback: "", // Empty feedback initially
        submittedFeedback: false, // Initially, feedback is not submitted
      });

      // Set the state to valid after processing
      this.isValid = true;
    },

    // Download the document
    downloadDocument() {
      if (this.currentFileUrl) {
        const link = document.createElement("a");
        link.href = this.currentFileUrl;
        link.download = this.document.name;
        link.click();
      } else {
        alert("No document to download.");
      }
    },

    // Preview the document in a new tab
    previewDocument() {
      if (this.currentFileUrl) {
        window.open(this.currentFileUrl, "_blank");
      } else {
        alert("No document to preview.");
      }
    },

    // Submit feedback and remove feedback field and button
    submitFeedback(item) {
      if (item.feedback.trim() === "") {
        alert("Feedback cannot be empty.");
        return;
      }

      const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14); // Format: YYYYMMDDHHMMSS
      const feedbackFileName = `${item.name.replace(/\.[^/.]+$/, "")}_feedback_${timestamp}.txt`;
      const blob = new Blob([item.feedback], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = feedbackFileName;
      link.click();

      item.submittedFeedback = true;
      item.feedback = ""; // Clear the feedback text
    },
  },
};
</script>

<style>
.main-page {
  display: flex;
  padding: 20px;
}

.content {
  display: flex;
  width: 100%;
}

.left-content {
  flex: 1;
  padding-right: 20px;
}

.sidebar {
  flex: 0 0 300px; /* Fixed width for sidebar */
  padding-left: 20px;
  border-left: 2px solid #ddd;
}

/* Unified button style for Validate, Preview, Download */
.action-button {
  width: 200px; /* Set a fixed width */
  height: 50px; /* Set a fixed height */
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}

/* Specific gray styling for Validate, Preview, and Download buttons */
.validate-btn,
.preview-btn,
.download-btn {
  background-color: gray;
  color: white;
}

.validate-btn:disabled,
.preview-btn:disabled,
.download-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Hover effects for the gray buttons */
.validate-btn:hover:not(:disabled),
.preview-btn:hover:not(:disabled),
.download-btn:hover:not(:disabled) {
  background-color: #888;
}

/* Vertical row layout for buttons after validation */
.button-row {
  display: flex;
  flex-direction: column; /* Arrange buttons vertically */
  gap: 2mm; /* 2mm space between buttons vertically */
  margin-top: 5mm; /* Add space above the button row */
}

/* Spacer for 5mm space between elements */
.spacer {
  height: 5mm; /* Add 5mm vertical space */
}

/* Small Spacer for 2mm space between Instruction and Validate */
.spacer-small {
  height: 10mm; /* Add 2mm vertical space */
}

/* Space between Validation and Preview */
.action-button + .action-button {
  margin-top: 2mm; /* 2mm space between Validation and Preview buttons */
}

/* Style for the icon and text */
.upload-icon-text {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #4caf50;
  cursor: pointer;
  margin-top: 20px;
}

.upload-icon-text i {
  font-size: 24px; /* Icon size */
  margin-right: 10px; /* Space between icon and text */
}

.upload-icon-text:hover {
  color: #45a049;
}

.upload-icon-text.uploaded {
  color: #505050; /* Dark gray when file is uploaded */
}

input[type="file"] {
  display: none; /* Hide the default file input */
}

/* History styles */
.history-item {
  margin-top: 20px;
}

.submit-btn {
  margin-top: 10px;
  width: 100px;
  height: auto;
  font-size: 14px;
}
</style>