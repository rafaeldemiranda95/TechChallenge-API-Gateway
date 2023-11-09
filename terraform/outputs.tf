output "cloud_function_name" {
  value = google_cloudfunctions_function.default.name
}

output "cloud_function_url" {
  value = google_cloudfunctions_function.default.https_trigger_url
}
