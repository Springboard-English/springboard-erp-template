import { useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";

import { Label, SearchableSelect } from "../../exports";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../exports";
import { useClasses, useGroups } from "./queries";
import type { TestScopeBody } from "./api";
import { useStableI18n } from "./i18n";
import { cn } from "../../lib/utils";

// Where a new test gets filed — shared by the New test dialog and the AI-extract
// "create a new test" path so both ask the question the same way.
//
// A test's scope is not filing metadata: it is the test's authorization parent,
// and the API enforces a different relation for each. A class test needs
// `editor` on the class, which teachers hold directly; a group test needs
// `editor` on the group, which only supervisor access-groups hold.
//
// So the two options are offered by capability, not by preference. `useGroups`
// 403s for a classroom teacher — no `groups_get` scope and no group relation —
// and that is the normal answer, not a failure: it means "you file under a
// class". A teacher therefore sees a class picker with no scope choice at all,
// while a manager who can reach both sees the choice.

export type TestScope =
  | { area: "class"; classKey: string }
  | { area: "group"; groupKey: string };

/** The scope as a POST body fragment, or null while it is still incomplete. */
export function scopeToCreateBody(scope: TestScope | null): TestScopeBody | null {
  if (!scope) return null;
  if (scope.area === "class") {
    return scope.classKey ? { area: "class", class_key: scope.classKey } : null;
  }
  return scope.groupKey ? { area: "group", group_key: scope.groupKey } : null;
}

/**
 * The same scope as a COLLECTION body fragment.
 *
 * A collection takes the two keys directly and has no `area` to select between
 * them — it can carry either, neither, or in principle both, where a test
 * carries exactly one chosen by its area. Only one is ever sent: a class
 * inherits from its group, so a class-scoped part is already reachable by that
 * group's supervisors and a second tuple would buy nothing.
 *
 * Empty (not null) when the scope is incomplete, so it can be spread into a
 * create body unconditionally.
 */
export function scopeToCollectionBody(
  scope: TestScope | null,
): { group_key?: string; class_key?: string } {
  const body = scopeToCreateBody(scope);
  if (!body) return {};
  return body.area === "class"
    ? { class_key: body.class_key }
    : { group_key: body.group_key };
}

export function TestScopeFields({
  scope,
  onChange,
  idPrefix,
  className,
}: {
  scope: TestScope | null;
  onChange: (scope: TestScope | null) => void;
  idPrefix: string;
  className?: string;
}) {
  const { t } = useStableI18n();
  const classes = useClasses();
  const groups = useGroups();

  // Only offer the group path to someone who demonstrably has it. An empty list
  // counts as "no" for the same reason a 403 does — either way there is nothing
  // to file under, and offering the choice would dead-end on an empty select.
  const canUseGroups = (groups.data?.length ?? 0) > 0;
  const canUseClasses = (classes.data?.length ?? 0) > 0;
  const settled = !classes.isLoading && !groups.isLoading;

  const options = useMemo(
    () =>
      (classes.data ?? []).map((klass) => ({
        key: klass.appsheet_key,
        label: klass.class_name,
        hint: klass.group_name,
      })),
    [classes.data],
  );

  // Preselect whatever the caller can actually use: the class path first, since
  // that is the common case, and a lone option needs no decision at all.
  useEffect(() => {
    if (scope || !settled) return;
    if (canUseClasses) {
      onChange({
        area: "class",
        classKey: options.length === 1 ? options[0].key : "",
      });
    } else if (canUseGroups) {
      const only = groups.data?.length === 1 ? groups.data[0].appsheet_key : "";
      onChange({ area: "group", groupKey: only });
    }
  }, [scope, settled, canUseClasses, canUseGroups, options, groups.data, onChange]);

  if (!settled) {
    return (
      <p className={cn("flex items-center gap-2 text-xs font-semibold text-muted-foreground", className)}>
        <Loader2 className="size-3.5 animate-spin" />
        {t("exercise.import.testScope.loading", "Finding where you can file a test…")}
      </p>
    );
  }

  // Neither path available. Say what would fix it rather than showing an empty
  // select — a teacher with no classes is a data problem, not a UI state.
  if (!canUseClasses && !canUseGroups) {
    return (
      <p className={cn("text-xs font-semibold text-error", className)}>
        {t(
          "exercise.import.testScope.nowhere",
          "You aren’t assigned to a class or a group yet, so there’s nowhere to file a test. Ask an administrator to add you to your class.",
        )}
      </p>
    );
  }

  return (
    <div className={cn("grid gap-4", className)}>
      {canUseClasses && canUseGroups ? (
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-area`}>{t("exercise.import.testScope.scope", "Scope")}</Label>
          <Select
            value={scope?.area ?? "class"}
            onValueChange={(area) =>
              onChange(
                area === "class"
                  ? { area: "class", classKey: "" }
                  : { area: "group", groupKey: "" },
              )
            }
          >
            <SelectTrigger id={`${idPrefix}-area`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="class">{t("exercise.import.testScope.aClass", "A class you teach")}</SelectItem>
              <SelectItem value="group">{t("exercise.import.testScope.aGroup", "A whole group")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {/* Searchable: a manager can reach every class and group, far more than a plain list scrolls well. */}
      {scope?.area === "group" ? (
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-group`}>{t("exercise.import.testScope.group", "Group")}</Label>
          <SearchableSelect
            id={`${idPrefix}-group`}
            className="w-full"
            value={scope.groupKey}
            placeholder={t("exercise.import.testScope.chooseGroup", "Choose a group")}
            options={(groups.data ?? []).map((group) => ({
              value: group.appsheet_key,
              label: group.name ?? group.appsheet_key,
            }))}
            onValueChange={(groupKey) => onChange({ area: "group", groupKey })}
          />
        </div>
      ) : (
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-class`}>{t("exercise.import.testScope.class", "Class")}</Label>
          <SearchableSelect
            id={`${idPrefix}-class`}
            className="w-full"
            value={scope?.area === "class" ? scope.classKey : ""}
            placeholder={t("exercise.import.testScope.chooseClass", "Choose a class")}
            options={options.map((option) => ({
              value: option.key,
              label: option.label,
              description: option.hint ?? undefined,
            }))}
            onValueChange={(classKey) => onChange({ area: "class", classKey })}
          />
        </div>
      )}
    </div>
  );
}
