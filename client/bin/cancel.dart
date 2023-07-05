import 'package:http/http.dart';

Future<void> main() async {
  Client client = Client();

  // Create a request controller, can be passed into multiple requests to
  // cancel them all at once or to set timeouts on all of them at once.
  // Or, one can be created per request.
  final controller = RequestController();

  final responseFuture = client.get(
    // URL that hangs for 5 seconds before responding.
    Uri.parse('http://localhost:3456/longrequest'),
    controller: controller,
  );

  controller.cancel();

  final response = await responseFuture;
  print(response.body);

  // Unhandled exception:
  // CancelledException: Request cancelled
  print(response.body);
}
