# Tracker for insights
# backend/insights/tracker.py

from collections import Counter


class InsightTracker:
    """
    Tracks lightweight session insights.
    """

    def __init__(self):
        self.total_questions = 0
        self.topic_frequency = Counter()
        self.explanation_modes = Counter()

    def log_question(self, question: str, mode: str):
        self.total_questions += 1
        keywords = question.lower().split()
        for word in keywords[:5]:
            self.topic_frequency[word] += 1
        self.explanation_modes[mode] += 1

    def get_insights(self):
        return {
            "total_questions": self.total_questions,
            "top_topics": self.topic_frequency.most_common(5),
            "explanation_modes_used": dict(self.explanation_modes),
        }


insight_tracker = InsightTracker()