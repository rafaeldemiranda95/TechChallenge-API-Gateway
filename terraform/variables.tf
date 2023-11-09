variable "project_id" {
  description = "The project ID to host the cloud function in"
}

variable "gcp_credentials_file" {
  description = "The GCP credentials file"
}

variable "region" {
  description = "The GCP region for cloud resources"
  default     = "us-central1"
}
