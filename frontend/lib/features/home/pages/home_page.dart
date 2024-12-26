import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:frontend/core/constants/utils.dart';
import 'package:frontend/features/home/pages/task.dart';
import 'package:frontend/features/widgets/date_selector.dart';
import 'package:frontend/features/widgets/task_card.dart';

class HomePage extends StatefulWidget {
  static MaterialPageRoute route() => MaterialPageRoute(
        builder: (context) => const HomePage(),
      );
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  DateTime selectedDate = DateTime.now();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("My Tasks"),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(context, AddNewTask.route());
            },
            icon: const Icon(
              CupertinoIcons.add,
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          DateSelector(
            selectedDate: selectedDate,
            onTap: (date) {
              setState(() {
                selectedDate = date;
              });
            },
          ),
          Row(
            children: [
              const Expanded(
                child: TaskCard(
                    color: Color.fromRGBO(246, 222, 194, 1),
                    headerText: 'Hello !',
                    descriptionText: 'This is a new Task!'),
              ),
              Container(
                height: 10,
                width: 10,
                decoration: BoxDecoration(
                  color: strengthenColor(
                      const Color.fromRGBO(246, 222, 194, 1), 0.69),
                  shape: BoxShape.circle,
                ),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  '10:00AM',
                  style: TextStyle(fontSize: 17),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}
