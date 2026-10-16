# Plan-only coverage for how the four component images are resolved. The
# published module stamps `image_tag` to its release, so every container must
# follow `image_registry` + `image_tag` unless a per-component URI is given.
# Run from terraform/litellm/aws with `terraform test`.

mock_provider "aws" {
  mock_data "aws_iam_policy_document" {
    defaults = {
      json = "{\"Version\":\"2012-10-17\",\"Statement\":[]}"
    }
  }
}
mock_provider "random" {}

variables {
  region              = "us-east-1"
  tenant              = "acme"
  env                 = "test"
  allow_plaintext_alb = true
  azs                 = ["us-east-1a", "us-east-1b"]
}

run "every_component_follows_image_registry_and_image_tag" {
  command = plan

  variables {
    image_registry = "123456789012.dkr.ecr.us-east-1.amazonaws.com/mirror"
    image_tag      = "v9.9.9"
  }

  assert {
    condition = (
      local.gateway_image == "123456789012.dkr.ecr.us-east-1.amazonaws.com/mirror/litellm-gateway:v9.9.9" &&
      local.backend_image == "123456789012.dkr.ecr.us-east-1.amazonaws.com/mirror/litellm-backend:v9.9.9" &&
      local.ui_image == "123456789012.dkr.ecr.us-east-1.amazonaws.com/mirror/litellm-ui:v9.9.9" &&
      local.migrations_image == "123456789012.dkr.ecr.us-east-1.amazonaws.com/mirror/litellm-migrations:v9.9.9"
    )
    error_message = "All four images must be composed as <image_registry>/litellm-<component>:<image_tag>."
  }
}

run "defaults_pull_the_module_release_from_ghcr" {
  command = plan

  assert {
    condition = alltrue([
      for image in [local.gateway_image, local.backend_image, local.ui_image, local.migrations_image] :
      startswith(image, "ghcr.io/berriai/litellm-") && endswith(image, ":${var.image_tag}")
    ])
    error_message = "Default images must come from ghcr.io/berriai at the module's image_tag."
  }

  assert {
    condition     = can(regex("^v[0-9]+\\.[0-9]+\\.[0-9]+", var.image_tag))
    error_message = "The default image_tag must be a v-prefixed release tag, matching what the publish job stamps."
  }
}

run "a_per_component_uri_wins_over_the_composed_image" {
  command = plan

  variables {
    image_tag     = "v9.9.9"
    gateway_image = "example.com/custom/gateway:nightly"
  }

  assert {
    condition = (
      local.gateway_image == "example.com/custom/gateway:nightly" &&
      local.backend_image == "ghcr.io/berriai/litellm-backend:v9.9.9" &&
      local.ui_image == "ghcr.io/berriai/litellm-ui:v9.9.9" &&
      local.migrations_image == "ghcr.io/berriai/litellm-migrations:v9.9.9"
    )
    error_message = "A per-component override must replace only that component's image."
  }
}
