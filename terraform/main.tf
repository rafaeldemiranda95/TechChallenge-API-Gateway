provider "google" {
  credentials = file(var.gcp_credentials_file)
  project     = var.project_id
  region      = var.region
}

resource "google_cloudfunctions_function" "default" {
  name                  = "YOUR_FUNCTION_NAME"
  description           = "My Cloud Function"
  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.cloud_functions_bucket.name
  source_archive_object = google_storage_bucket_object.source_archive.name
  trigger_http          = true
  entry_point           = "YOUR_FUNCTION_ENTRYPOINT"
  runtime               = "nodejs14"

  environment_variables = {
    EXAMPLE_VARIABLE = "example_value"
  }
}

resource "google_storage_bucket" "cloud_functions_bucket" {
  name          = "techchallenge-api-gateway-bucket"
  location      = var.region
  force_destroy = true
}

resource "google_storage_bucket_object" "source_archive" {
  name   = "source.zip"
  bucket = google_storage_bucket.cloud_functions_bucket.name
  source = "../path/to/your/source/code.zip"
}
