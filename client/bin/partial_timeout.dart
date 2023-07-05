import 'package:http/http.dart';

Future<void> main() async {
  Client client = Client();

  // Create a request controller, can be passed into multiple requests to
  // cancel them all at once or to set timeouts on all of them at once.
  // Or, one can be created per request.
  final controller = RequestController(
    // Optional timeout for the overall request (entire round trip).
    timeout: Duration(seconds: 5),
    // Optional timeouts for each state of the request.
    // If a state is not specified, it will not timeout.
    partialTimeouts: PartialTimeouts(
      // Timeout for connecting to the server.
      connectTimeout: Duration(seconds: 5),
      // Timeout for the request body to be sent and a response to become
      // available from the server.
      sendTimeout: Duration(seconds: 4),
      // Timeout for processing the response body client-side.
      receiveTimeout: Duration(seconds: 6),
    ),
  );

  final response = await client.get(
    // URL that hangs for 5 seconds before responding.
    Uri.parse('http://localhost:3456/longrequest'),
    controller: controller,
  );

  // Unhandled exception:
  // TimeoutException after 0:00:04.000000: Future not completed
  print(response.body);
}
