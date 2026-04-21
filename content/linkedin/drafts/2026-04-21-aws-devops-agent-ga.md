# AWS DevOps Agent GA - The Un-Sexy Prework Decides Whether You Get the 75% Win

**Pillar:** 1 (Platform Engineering Leader)
**Format:** Text post
**Blog-worthy:** Maybe - Could anchor a longer piece on "AIOps agents are a pre-work amplifier, not a platform" grounded in the financial institution ServiceNow transformation and NaviHealth observability build.
**Adjacency:** Fresh. Complements without overlapping 4/17 Dapr (runtime), 4/20 OutSystems (org), 4/16 Lightrun (AI code debug).

## Trending

AWS DevOps Agent hit GA on April 18. Preview numbers: up to 75% lower MTTR and 94% root cause accuracy. Built on Amazon Bedrock AgentCore. Integrates via MCP and built-in connectors with CloudWatch, Datadog, Dynatrace, New Relic, Splunk, Grafana, PagerDuty, ServiceNow, GitHub, GitLab, and Azure DevOps. Billed per second of agent runtime. InfoQ and Reddit caught the tension underneath.

### Sources

- [InfoQ: AWS Announces GA of DevOps Agent](https://www.infoq.com/news/2026/04/aws-devops-agent-ga/)
- [AWS: Announcing GA of AWS DevOps Agent](https://aws.amazon.com/blogs/mt/announcing-general-availability-of-aws-devops-agent/)
- [Reddit: r/aws thread](https://www.reddit.com/r/aws/comments/1say2v0/aws_deploys_ai_agents_to_do_the_work_of_devops/)

## Draft

AWS made DevOps Agent generally available last Friday. The claim from preview data is a 75% drop in MTTR and 94% root cause accuracy. It integrates with CloudWatch, Datadog, Dynatrace, Splunk, Grafana, PagerDuty, and ServiceNow, and now bills per second of agent runtime.

The most honest response to the announcement was on the AWS subreddit: "Is that the same one that dropped a production environment last month?"

That comment is the real story. I spent two years leading an AIOps transformation at a multibillion-dollar global financial institution on ServiceNow and Azure. We cut unstructured incident costs by 60%. That number was not delivered by the AI. It came from the months of work upstream of it: tagging services, cleaning a CMDB that was 30% fiction, rewriting noisy alerts, wiring runbooks into code, and building a clean escalation path for the cases where the agent was wrong.

If you drop DevOps Agent into an environment with stale runbooks, noisy alerts, and no agreement on what a P1 actually looks like, the agent will confidently give you wrong answers faster than a human ever could. Corey Quinn said it best. "MTTR drops from hours to minutes; invoices go from minutes to hours."

The enterprises that actually earn the 75% win are the ones doing the un-sexy prework. Data hygiene, ownership maps, policy-as-code, and a human-in-the-loop path for the slice of cases the agent should not touch alone.

You cannot agent your way out of an ops environment nobody maintains. Every AI ops tool is an amplifier of whatever operational discipline is already there.

If you rolled out an autonomous incident response agent tomorrow, what percentage of your runbooks would actually be accurate enough for it to act on?

## Hashtags

#PlatformEngineering #AIOps #SRE #IncidentResponse #AWS
