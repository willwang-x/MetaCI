# Generated by Django 2.1.7 on 2019-04-23 16:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("plan", "0026_auto_20190209_0101"),
        ("repository", "0006_remove_repository_public"),
        ("testresults", "0018_auto_20190417_1730"),
    ]

    operations = [
        migrations.CreateModel(
            name="TestResultPerfWeeklySummary",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("agg_duration_average", models.FloatField(null=True)),
                ("agg_duration_slow", models.FloatField(null=True)),
                ("agg_duration_fast", models.FloatField(null=True)),
                ("agg_cpu_usage_average", models.FloatField(null=True)),
                ("agg_cpu_usage_low", models.FloatField(null=True)),
                ("agg_cpu_usage_high", models.FloatField(null=True)),
                ("agg_count", models.IntegerField()),
                ("agg_failures", models.IntegerField()),
                ("agg_assertion_failures", models.IntegerField()),
                ("agg_DML_failures", models.IntegerField()),
                ("agg_other_failures", models.IntegerField()),
                ("week_start", models.DateField()),
            ],
            options={
                "verbose_name": "Test Results Weekly Performance Summary",
                "verbose_name_plural": "Test Results Weekly Performance Summaries",
                "db_table": "testresult_weekly_perfsummary",
            },
        ),
        migrations.AddField(
            model_name="testresultperfweeklysummary",
            name="method",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT, to="testresults.TestMethod"
            ),
        ),
        migrations.AddField(
            model_name="testresultperfweeklysummary",
            name="rel_branch",
            field=models.ForeignKey(
                db_column="branch_id",
                on_delete=django.db.models.deletion.PROTECT,
                to="repository.Branch",
            ),
        ),
        migrations.AddField(
            model_name="testresultperfweeklysummary",
            name="rel_plan",
            field=models.ForeignKey(
                db_column="plan_id",
                on_delete=django.db.models.deletion.PROTECT,
                to="plan.Plan",
            ),
        ),
        migrations.AddField(
            model_name="testresultperfweeklysummary",
            name="rel_repo",
            field=models.ForeignKey(
                db_column="repo_id",
                on_delete=django.db.models.deletion.PROTECT,
                to="repository.Repository",
            ),
        ),
        migrations.AddIndex(
            model_name="testresultperfweeklysummary",
            index=models.Index(
                fields=["rel_repo", "rel_branch", "rel_plan", "method", "week_start"],
                name="weekly_lookup",
            ),
        ),
        migrations.AlterUniqueTogether(
            name="testresultperfweeklysummary",
            unique_together={
                ("rel_repo", "rel_branch", "rel_plan", "method", "week_start")
            },
        ),
    ]