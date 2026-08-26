import $ from "jquery";

export default function initButtonAnimation(): void {
  const $button = $("#button");

  $button.on("click", function () {
    $button.addClass("onclic");
    setTimeout(validate, 250);
  });

  function validate(): void {
    setTimeout(function () {
      $button.removeClass("onclic");
      $button.addClass("validate");
      setTimeout(callback, 450);
    }, 2250);
  }

  function callback(): void {
    setTimeout(function () {
      $button.removeClass("validate");
    }, 1250);
  }
}